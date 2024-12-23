"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const check_1 = require("meteor/check");
const eraseRoom_1 = require("../../../../server/lib/eraseRoom");
const server_1 = require("../../../authorization/server");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const removeUserFromRoom_1 = require("../../../lib/server/functions/removeUserFromRoom");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
api_1.API.v1.addRoute('teams.list', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, query } = yield this.parseJsonQuery();
            const { records, total } = yield core_services_1.Team.list(this.userId, { offset, count }, { sort, query });
            return api_1.API.v1.success({
                teams: records,
                total,
                count: records.length,
                offset,
            });
        });
    },
});
api_1.API.v1.addRoute('teams.listAll', { authRequired: true, permissionsRequired: ['view-all-teams'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { records, total } = yield core_services_1.Team.listAll({ offset, count });
            return api_1.API.v1.success({
                teams: records,
                total,
                count: records.length,
                offset,
            });
        });
    },
});
api_1.API.v1.addRoute('teams.create', { authRequired: true, permissionsRequired: ['create-team'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, check_1.Match.ObjectIncluding({
                name: String,
                type: check_1.Match.OneOf(core_typings_1.TEAM_TYPE.PRIVATE, core_typings_1.TEAM_TYPE.PUBLIC),
                members: check_1.Match.Maybe([String]),
                room: check_1.Match.Maybe(check_1.Match.Any),
                owner: check_1.Match.Maybe(String),
            }));
            const { name, type, members, room, owner, sidepanel } = this.bodyParams;
            if ((sidepanel === null || sidepanel === void 0 ? void 0 : sidepanel.items) && !(0, core_typings_1.isValidSidepanel)(sidepanel)) {
                throw new Error('error-invalid-sidepanel');
            }
            const team = yield core_services_1.Team.create(this.userId, {
                team: {
                    name,
                    type,
                },
                room,
                members,
                owner,
                sidepanel,
            });
            return api_1.API.v1.success({ team });
        });
    },
});
const getTeamByIdOrName = (params) => __awaiter(void 0, void 0, void 0, function* () {
    if ('teamId' in params && params.teamId) {
        return core_services_1.Team.getOneById(params.teamId);
    }
    if ('teamName' in params && params.teamName) {
        return core_services_1.Team.getOneByName(params.teamName);
    }
    return null;
});
api_1.API.v1.addRoute('teams.convertToChannel', {
    authRequired: true,
    validateParams: rest_typings_1.isTeamsConvertToChannelProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const { roomsToRemove = [] } = this.bodyParams;
            const team = yield getTeamByIdOrName(this.bodyParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'convert-team', team.roomId))) {
                return api_1.API.v1.unauthorized();
            }
            const rooms = yield core_services_1.Team.getMatchingTeamRooms(team._id, roomsToRemove);
            if (rooms.length) {
                try {
                    for (var _d = true, rooms_1 = __asyncValues(rooms), rooms_1_1; rooms_1_1 = yield rooms_1.next(), _a = rooms_1_1.done, !_a; _d = true) {
                        _c = rooms_1_1.value;
                        _d = false;
                        const room = _c;
                        yield (0, eraseRoom_1.eraseRoom)(room, this.userId);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = rooms_1.return)) yield _b.call(rooms_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            yield Promise.all([core_services_1.Team.unsetTeamIdOfRooms(this.userId, team._id), core_services_1.Team.removeAllMembersFromTeam(team._id)]);
            yield core_services_1.Team.deleteById(team._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('teams.addRooms', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, check_1.Match.OneOf(check_1.Match.ObjectIncluding({
                teamId: String,
                rooms: [String],
            }), check_1.Match.ObjectIncluding({
                teamName: String,
                rooms: [String],
            })));
            const team = yield getTeamByIdOrName(this.bodyParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'move-room-to-team', team.roomId))) {
                return api_1.API.v1.unauthorized('error-no-permission-team-channel');
            }
            const { rooms } = this.bodyParams;
            const validRooms = yield core_services_1.Team.addRooms(this.userId, rooms, team._id);
            return api_1.API.v1.success({ rooms: validRooms });
        });
    },
});
api_1.API.v1.addRoute('teams.removeRoom', {
    authRequired: true,
    validateParams: rest_typings_1.isTeamsRemoveRoomProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield getTeamByIdOrName(this.bodyParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'remove-team-channel', team.roomId))) {
                return api_1.API.v1.unauthorized();
            }
            const canRemoveAny = !!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-team-channels', team.roomId));
            const { roomId } = this.bodyParams;
            const room = yield core_services_1.Team.removeRoom(this.userId, roomId, team._id, canRemoveAny);
            return api_1.API.v1.success({ room });
        });
    },
});
api_1.API.v1.addRoute('teams.updateRoom', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, check_1.Match.ObjectIncluding({
                roomId: String,
                isDefault: Boolean,
            }));
            const { roomId, isDefault } = this.bodyParams;
            const team = yield core_services_1.Team.getOneByRoomId(roomId);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-team-channel', team.roomId))) {
                return api_1.API.v1.unauthorized();
            }
            const canUpdateAny = !!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-team-channels', team.roomId));
            const room = yield core_services_1.Team.updateRoom(this.userId, roomId, isDefault, canUpdateAny);
            return api_1.API.v1.success({ room });
        });
    },
});
api_1.API.v1.addRoute('teams.listRooms', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.OneOf(check_1.Match.ObjectIncluding({
                teamId: String,
            }), check_1.Match.ObjectIncluding({
                teamName: String,
            })));
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                filter: check_1.Match.Maybe(String),
                type: check_1.Match.Maybe(String),
                offset: check_1.Match.Maybe(String),
                count: check_1.Match.Maybe(String),
            }));
            const { filter, type } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const team = yield getTeamByIdOrName(this.queryParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            const allowPrivateTeam = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-teams', team.roomId);
            const getAllRooms = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-team-channels', team.roomId);
            const listFilter = {
                name: filter !== null && filter !== void 0 ? filter : undefined,
                isDefault: type === 'autoJoin',
                getAllRooms,
                allowPrivateTeam,
            };
            const { records, total } = yield core_services_1.Team.listRooms(this.userId, team._id, listFilter, {
                offset,
                count,
            });
            return api_1.API.v1.success({
                rooms: records,
                total,
                count: records.length,
                offset,
            });
        });
    },
});
api_1.API.v1.addRoute('teams.listRoomsOfUser', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.OneOf(check_1.Match.ObjectIncluding({
                teamId: String,
            }), check_1.Match.ObjectIncluding({
                teamName: String,
            })));
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                userId: String,
                canUserDelete: check_1.Match.Maybe(String),
                offset: check_1.Match.Maybe(String),
                count: check_1.Match.Maybe(String),
            }));
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const team = yield getTeamByIdOrName(this.queryParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            const allowPrivateTeam = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-teams', team.roomId);
            const { userId, canUserDelete } = this.queryParams;
            if (!(this.userId === userId || (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-team-channels', team.roomId)))) {
                return api_1.API.v1.unauthorized();
            }
            const booleanCanUserDelete = canUserDelete === 'true';
            const { records, total } = yield core_services_1.Team.listRoomsOfUser(this.userId, team._id, userId, allowPrivateTeam, booleanCanUserDelete, {
                offset,
                count,
            });
            return api_1.API.v1.success({
                rooms: records,
                total,
                count: records.length,
                offset: 0,
            });
        });
    },
});
const getTeamByIdOrNameOrParentRoom = (params) => __awaiter(void 0, void 0, void 0, function* () {
    if ('teamId' in params && params.teamId) {
        return core_services_1.Team.getOneById(params.teamId, { projection: { type: 1, roomId: 1 } });
    }
    if ('teamName' in params && params.teamName) {
        return core_services_1.Team.getOneByName(params.teamName, { projection: { type: 1, roomId: 1 } });
    }
    if ('roomId' in params && params.roomId) {
        return core_services_1.Team.getOneByRoomId(params.roomId, { projection: { type: 1, roomId: 1 } });
    }
    return null;
});
// This should accept a teamId, filter (search by name on rooms collection) and sort/pagination
// should return a list of rooms/discussions from the team. the discussions will only be returned from the main room
api_1.API.v1.addRoute('teams.listChildren', { authRequired: true, validateParams: rest_typings_1.isTeamsListChildrenProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { filter, type } = this.queryParams;
            const team = yield getTeamByIdOrNameOrParentRoom(this.queryParams);
            if (!team) {
                return api_1.API.v1.notFound();
            }
            const data = yield core_services_1.Team.listChildren(this.userId, team, filter, type, sort, offset, count);
            return api_1.API.v1.success(Object.assign(Object.assign({}, data), { offset, count }));
        });
    },
});
api_1.API.v1.addRoute('teams.members', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            (0, check_1.check)(this.queryParams, check_1.Match.OneOf(check_1.Match.ObjectIncluding({
                teamId: String,
            }), check_1.Match.ObjectIncluding({
                teamName: String,
            })));
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                status: check_1.Match.Maybe([String]),
                username: check_1.Match.Maybe(String),
                name: check_1.Match.Maybe(String),
            }));
            const { status, username, name } = this.queryParams;
            const team = yield getTeamByIdOrName(this.queryParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            const canSeeAllMembers = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-teams', team.roomId);
            const query = {
                username: username ? new RegExp((0, string_helpers_1.escapeRegExp)(username), 'i') : undefined,
                name: name ? new RegExp((0, string_helpers_1.escapeRegExp)(name), 'i') : undefined,
                status: status ? { $in: status } : undefined,
            };
            const { records, total } = yield core_services_1.Team.members(this.userId, team._id, canSeeAllMembers, { offset, count }, query);
            return api_1.API.v1.success({
                members: records,
                total,
                count: records.length,
                offset,
            });
        });
    },
});
api_1.API.v1.addRoute('teams.addMembers', {
    authRequired: true,
    validateParams: rest_typings_1.isTeamsAddMembersProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bodyParams } = this;
            const { members } = bodyParams;
            const team = yield getTeamByIdOrName(this.bodyParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            if (!(yield (0, hasPermission_1.hasAtLeastOnePermissionAsync)(this.userId, ['add-team-member', 'edit-team-member'], team.roomId))) {
                return api_1.API.v1.unauthorized();
            }
            yield core_services_1.Team.addMembers(this.userId, team._id, members);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('teams.updateMember', {
    authRequired: true,
    validateParams: rest_typings_1.isTeamsUpdateMemberProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bodyParams } = this;
            const { member } = bodyParams;
            const team = yield getTeamByIdOrName(this.bodyParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            if (!(yield (0, hasPermission_1.hasAtLeastOnePermissionAsync)(this.userId, ['edit-team-member'], team.roomId))) {
                return api_1.API.v1.unauthorized();
            }
            yield core_services_1.Team.updateMember(team._id, member);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('teams.removeMember', {
    authRequired: true,
    validateParams: rest_typings_1.isTeamsRemoveMemberProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bodyParams } = this;
            const { userId, rooms } = bodyParams;
            const team = yield getTeamByIdOrName(this.bodyParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            if (!(yield (0, hasPermission_1.hasAtLeastOnePermissionAsync)(this.userId, ['edit-team-member'], team.roomId))) {
                return api_1.API.v1.unauthorized();
            }
            const user = yield models_1.Users.findOneActiveById(userId, {});
            if (!user) {
                return api_1.API.v1.failure('invalid-user');
            }
            if (!(yield core_services_1.Team.removeMembers(this.userId, team._id, [{ userId }]))) {
                return api_1.API.v1.failure();
            }
            if (rooms === null || rooms === void 0 ? void 0 : rooms.length) {
                const roomsFromTeam = yield core_services_1.Team.getMatchingTeamRooms(team._id, rooms);
                yield Promise.all(roomsFromTeam.map((rid) => (0, removeUserFromRoom_1.removeUserFromRoom)(rid, user, {
                    byUser: this.user,
                })));
            }
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('teams.leave', {
    authRequired: true,
    validateParams: rest_typings_1.isTeamsLeaveProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rooms = [] } = this.bodyParams;
            const team = yield getTeamByIdOrName(this.bodyParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            yield core_services_1.Team.removeMembers(this.userId, team._id, [
                {
                    userId: this.userId,
                },
            ]);
            if (rooms.length) {
                const roomsFromTeam = yield core_services_1.Team.getMatchingTeamRooms(team._id, rooms);
                yield Promise.all(roomsFromTeam.map((rid) => (0, removeUserFromRoom_1.removeUserFromRoom)(rid, this.user)));
            }
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('teams.info', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.OneOf(check_1.Match.ObjectIncluding({
                teamId: String,
            }), check_1.Match.ObjectIncluding({
                teamName: String,
            })));
            const teamInfo = yield getTeamByIdOrName(this.queryParams);
            if (!teamInfo) {
                return api_1.API.v1.failure('Team not found');
            }
            const room = yield models_1.Rooms.findOneById(teamInfo.roomId);
            if (!room) {
                return api_1.API.v1.failure('Room not found');
            }
            const canViewInfo = (yield (0, server_1.canAccessRoomAsync)(room, { _id: this.userId })) || (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-teams'));
            if (!canViewInfo) {
                return api_1.API.v1.unauthorized();
            }
            return api_1.API.v1.success({ teamInfo });
        });
    },
});
api_1.API.v1.addRoute('teams.delete', {
    authRequired: true,
    validateParams: rest_typings_1.isTeamsDeleteProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_2, _b, _c;
            const { roomsToRemove = [] } = this.bodyParams;
            const team = yield getTeamByIdOrName(this.bodyParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'delete-team', team.roomId))) {
                return api_1.API.v1.unauthorized();
            }
            const rooms = yield core_services_1.Team.getMatchingTeamRooms(team._id, roomsToRemove);
            // If we got a list of rooms to delete along with the team, remove them first
            if (rooms.length) {
                try {
                    for (var _d = true, rooms_2 = __asyncValues(rooms), rooms_2_1; rooms_2_1 = yield rooms_2.next(), _a = rooms_2_1.done, !_a; _d = true) {
                        _c = rooms_2_1.value;
                        _d = false;
                        const room = _c;
                        yield (0, eraseRoom_1.eraseRoom)(room, this.userId);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = rooms_2.return)) yield _b.call(rooms_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            // Move every other room back to the workspace
            yield core_services_1.Team.unsetTeamIdOfRooms(this.userId, team._id);
            // Remove the team's main room
            yield (0, eraseRoom_1.eraseRoom)(team.roomId, this.userId);
            // Delete all team memberships
            yield core_services_1.Team.removeAllMembersFromTeam(team._id);
            // And finally delete the team itself
            yield core_services_1.Team.deleteById(team._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('teams.autocomplete', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                name: String,
            }));
            const { name } = this.queryParams;
            const teams = yield core_services_1.Team.autocomplete(this.userId, name);
            return api_1.API.v1.success({ teams });
        });
    },
});
api_1.API.v1.addRoute('teams.update', {
    authRequired: true,
    validateParams: rest_typings_1.isTeamsUpdateProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = this.bodyParams;
            const team = yield getTeamByIdOrName(this.bodyParams);
            if (!team) {
                return api_1.API.v1.failure('team-does-not-exist');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-team', team.roomId))) {
                return api_1.API.v1.unauthorized();
            }
            yield core_services_1.Team.update(this.userId, team._id, data);
            return api_1.API.v1.success();
        });
    },
});
