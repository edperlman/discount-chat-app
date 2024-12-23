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
exports.TeamService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const server_1 = require("../../../app/channel-settings/server");
const saveRoomType_1 = require("../../../app/channel-settings/server/functions/saveRoomType");
const addUserToRoom_1 = require("../../../app/lib/server/functions/addUserToRoom");
const checkUsernameAvailability_1 = require("../../../app/lib/server/functions/checkUsernameAvailability");
const getRoomsWithSingleOwner_1 = require("../../../app/lib/server/functions/getRoomsWithSingleOwner");
const removeUserFromRoom_1 = require("../../../app/lib/server/functions/removeUserFromRoom");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
const server_2 = require("../../../app/settings/server");
class TeamService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'team';
    }
    create(uid_1, _a) {
        return __awaiter(this, arguments, void 0, function* (uid, { team, room = { name: team.name, extraData: {} }, members, owner, sidepanel }) {
            if (!(yield (0, checkUsernameAvailability_1.checkUsernameAvailability)(team.name))) {
                throw new Error('team-name-already-exists');
            }
            const existingRoom = yield models_1.Rooms.findOneByName(team.name, { projection: { _id: 1 } });
            if (existingRoom && existingRoom._id !== room.id) {
                throw new Error('room-name-already-exists');
            }
            const createdBy = yield models_1.Users.findOneById(uid, {
                projection: { username: 1 },
            });
            if (!createdBy) {
                throw new Error('invalid-user');
            }
            // TODO add validations to `data` and `members`
            const membersResult = !members || !Array.isArray(members) || members.length === 0
                ? []
                : yield models_1.Users.findActiveByIdsOrUsernames(members, {
                    projection: { username: 1 },
                }).toArray();
            const memberUsernames = membersResult.map(({ username }) => username);
            const memberIds = membersResult.map(({ _id }) => _id);
            const teamData = Object.assign(Object.assign({}, team), { createdAt: new Date(), createdBy, _updatedAt: new Date(), roomId: '' });
            try {
                const roomId = room.id ||
                    (yield core_services_1.Room.create(owner || uid, Object.assign(Object.assign({}, room), { type: team.type === core_typings_1.TEAM_TYPE.PRIVATE ? 'p' : 'c', name: team.name, members: memberUsernames, extraData: Object.assign({}, room.extraData), sidepanel })))._id;
                const result = yield models_1.Team.insertOne(teamData);
                const teamId = result.insertedId;
                // the same uid can be passed at 3 positions: owner, member list or via caller
                // if the owner is present, remove it from the members list
                // if the owner is not present, remove the caller from the members list
                const excludeFromMembers = owner ? [owner] : [uid];
                // filter empty strings and falsy values from members list
                const membersList = (memberIds === null || memberIds === void 0 ? void 0 : memberIds.filter(Boolean).filter((memberId) => !excludeFromMembers.includes(memberId)).map((memberId) => ({
                    teamId,
                    userId: memberId,
                    createdAt: new Date(),
                    createdBy,
                }))) || [];
                membersList.push({
                    teamId,
                    userId: owner || uid,
                    roles: ['owner'],
                    createdAt: new Date(),
                    createdBy,
                });
                yield models_1.TeamMember.insertMany(membersList);
                yield models_1.Rooms.setTeamMainById(roomId, teamId);
                yield models_1.Team.updateMainRoomForTeam(teamId, roomId);
                teamData.roomId = roomId;
                if (room.id) {
                    yield core_services_1.Message.saveSystemMessage('user-converted-to-team', roomId, team.name, createdBy);
                }
                void (0, notifyListener_1.notifyOnRoomChangedById)(roomId, 'inserted');
                return Object.assign({ _id: teamId }, teamData);
            }
            catch (e) {
                throw new Error('error-team-creation');
            }
        });
    }
    update(uid, teamId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield models_1.Team.findOneById(teamId, {
                projection: { roomId: 1 },
            });
            if (!team) {
                return;
            }
            const user = yield models_1.Users.findOneById(uid);
            if (!user) {
                return;
            }
            const { name, type, updateRoom = true } = updateData;
            if (updateRoom && name) {
                yield (0, server_1.saveRoomName)(team.roomId, name, user);
            }
            if (updateRoom && typeof type !== 'undefined') {
                yield (0, saveRoomType_1.saveRoomType)(team.roomId, type === core_typings_1.TEAM_TYPE.PRIVATE ? 'p' : 'c', user);
            }
            yield models_1.Team.updateNameAndType(teamId, updateData);
        });
    }
    findBySubscribedUserIds(userId, callerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const unfilteredTeams = yield models_1.TeamMember.findByUserId(userId, {
                projection: { teamId: 1, roles: 1 },
            }).toArray();
            const unfilteredTeamIds = unfilteredTeams.map(({ teamId }) => teamId);
            let teamIds = unfilteredTeamIds;
            if (callerId) {
                const publicTeams = yield models_1.Team.findByIdsAndType(unfilteredTeamIds, core_typings_1.TEAM_TYPE.PUBLIC, {
                    projection: { _id: 1 },
                }).toArray();
                const publicTeamIds = publicTeams.map(({ _id }) => _id);
                const privateTeamIds = unfilteredTeamIds.filter((teamId) => !publicTeamIds.includes(teamId));
                const privateTeams = yield models_1.TeamMember.findByUserIdAndTeamIds(callerId, privateTeamIds, {
                    projection: { teamId: 1 },
                }).toArray();
                const visibleTeamIds = privateTeams.map(({ teamId }) => teamId).concat(publicTeamIds);
                teamIds = unfilteredTeamIds.filter((teamId) => visibleTeamIds.includes(teamId));
            }
            const ownedTeams = unfilteredTeams.filter(({ roles = [] }) => roles.includes('owner')).map(({ teamId }) => teamId);
            const results = yield models_1.Team.findByIds(teamIds).toArray();
            return results.map((team) => (Object.assign(Object.assign({}, team), { isOwner: ownedTeams.includes(team._id) })));
        });
    }
    search(userId, term, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof term === 'string') {
                term = new RegExp(`^${(0, string_helpers_1.escapeRegExp)(term)}`, 'i');
            }
            const userTeams = yield models_1.TeamMember.findByUserId(userId, {
                projection: { teamId: 1 },
            }).toArray();
            const teamIds = userTeams.map(({ teamId }) => teamId);
            return models_1.Team.findByNameAndTeamIds(term, teamIds, options || {}).toArray();
        });
    }
    list(uid_1) {
        return __awaiter(this, arguments, void 0, function* (uid, { offset, count } = { offset: 0, count: 50 }, { sort, query } = { sort: {} }) {
            var _a, e_1, _b, _c;
            const userTeams = yield models_1.TeamMember.findByUserId(uid, {
                projection: { teamId: 1 },
            }).toArray();
            const teamIds = userTeams.map(({ teamId }) => teamId);
            if (teamIds.length === 0) {
                return {
                    total: 0,
                    records: [],
                };
            }
            const { cursor, totalCount } = models_1.Team.findByIdsPaginated(teamIds, Object.assign(Object.assign({}, (sort && { sort })), { limit: count, skip: offset }), query);
            const [records, total] = yield Promise.all([cursor.toArray(), totalCount]);
            const results = [];
            try {
                for (var _d = true, records_1 = __asyncValues(records), records_1_1; records_1_1 = yield records_1.next(), _a = records_1_1.done, !_a; _d = true) {
                    _c = records_1_1.value;
                    _d = false;
                    const record = _c;
                    results.push(Object.assign(Object.assign({}, record), { rooms: yield models_1.Rooms.countByTeamId(record._id), numberOfUsers: yield models_1.TeamMember.countByTeamId(record._id) }));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = records_1.return)) yield _b.call(records_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return {
                total,
                records: results,
            };
        });
    }
    listAll() {
        return __awaiter(this, arguments, void 0, function* ({ offset, count } = { offset: 0, count: 50 }) {
            var _a, e_2, _b, _c;
            const { cursor, totalCount } = models_1.Team.findPaginated({}, {
                limit: count,
                skip: offset,
            });
            const [records, total] = yield Promise.all([cursor.toArray(), totalCount]);
            const results = [];
            try {
                for (var _d = true, records_2 = __asyncValues(records), records_2_1; records_2_1 = yield records_2.next(), _a = records_2_1.done, !_a; _d = true) {
                    _c = records_2_1.value;
                    _d = false;
                    const record = _c;
                    results.push(Object.assign(Object.assign({}, record), { rooms: yield models_1.Rooms.countByTeamId(record._id), numberOfUsers: yield models_1.TeamMember.countByTeamId(record._id) }));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = records_2.return)) yield _b.call(records_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return {
                total,
                records: results,
            };
        });
    }
    listByNames(names, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options === undefined) {
                return models_1.Team.findByNames(names).toArray();
            }
            return models_1.Team.findByNames(names, options).toArray();
        });
    }
    listByIds(ids, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Team.findByIds(ids, options).toArray();
        });
    }
    addRooms(uid, rooms, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_3, _b, _c, _d, e_4, _e, _f;
            if (!teamId) {
                throw new Error('missing-teamId');
            }
            if (!rooms) {
                throw new Error('missing-rooms');
            }
            if (!uid) {
                throw new Error('missing-userId');
            }
            const team = yield models_1.Team.findOneById(teamId, { projection: { _id: 1, roomId: 1 } });
            if (!team) {
                throw new Error('invalid-team');
            }
            // at this point, we already checked for the permission
            // so we just need to check if the user can see the room
            const user = yield models_1.Users.findOneById(uid);
            if (!user) {
                throw new Error('invalid-user');
            }
            const rids = rooms.filter((rid) => rid && typeof rid === 'string');
            const validRooms = yield models_1.Rooms.findManyByRoomIds(rids).toArray();
            if (validRooms.length < rids.length) {
                throw new Error('invalid-room');
            }
            try {
                // validate access for every room first
                for (var _g = true, validRooms_1 = __asyncValues(validRooms), validRooms_1_1; validRooms_1_1 = yield validRooms_1.next(), _a = validRooms_1_1.done, !_a; _g = true) {
                    _c = validRooms_1_1.value;
                    _g = false;
                    const room = _c;
                    const canSeeRoom = yield core_services_1.Authorization.canAccessRoom(room, user);
                    if (!canSeeRoom) {
                        throw new Error('invalid-room');
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_g && !_a && (_b = validRooms_1.return)) yield _b.call(validRooms_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var _h = true, validRooms_2 = __asyncValues(validRooms), validRooms_2_1; validRooms_2_1 = yield validRooms_2.next(), _d = validRooms_2_1.done, !_d; _h = true) {
                    _f = validRooms_2_1.value;
                    _h = false;
                    const room = _f;
                    if (room.teamId) {
                        throw new Error('room-already-on-team');
                    }
                    if (!(yield models_1.Subscriptions.isUserInRole(uid, 'owner', room._id))) {
                        throw new Error('error-no-owner-channel');
                    }
                    if (room.t === 'c') {
                        yield core_services_1.Message.saveSystemMessage('user-added-room-to-team', team.roomId, room.name || '', user);
                    }
                    room.teamId = teamId;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_h && !_d && (_e = validRooms_2.return)) yield _e.call(validRooms_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
            yield models_1.Rooms.setTeamByIds(rids, teamId);
            void (0, notifyListener_1.notifyOnRoomChangedById)(rids, 'updated');
            return validRooms;
        });
    }
    removeRoom(uid_1, rid_1, teamId_1) {
        return __awaiter(this, arguments, void 0, function* (uid, rid, teamId, canRemoveAnyRoom = false) {
            if (!teamId) {
                throw new Error('missing-teamId');
            }
            if (!rid) {
                throw new Error('missing-roomId');
            }
            if (!uid) {
                throw new Error('missing-userId');
            }
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            const user = yield models_1.Users.findOneById(uid);
            if (!user) {
                throw new Error('invalid-user');
            }
            if (!canRemoveAnyRoom) {
                const canSeeRoom = yield core_services_1.Authorization.canAccessRoom(room, user);
                if (!canSeeRoom) {
                    throw new Error('invalid-room');
                }
            }
            const team = yield models_1.Team.findOneById(teamId, { projection: { _id: 1, roomId: 1 } });
            if (!team) {
                throw new Error('invalid-team');
            }
            if (room.teamId !== teamId) {
                throw new Error('room-not-on-that-team');
            }
            delete room.teamId;
            delete room.teamDefault;
            yield models_1.Rooms.unsetTeamById(room._id);
            void (0, notifyListener_1.notifyOnRoomChangedById)(room._id, 'updated');
            if (room.t === 'c') {
                yield core_services_1.Message.saveSystemMessage('user-removed-room-from-team', team.roomId, room.name || '', user);
            }
            return Object.assign({}, room);
        });
    }
    unsetTeamIdOfRooms(uid, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!teamId) {
                throw new Error('missing-teamId');
            }
            const team = yield models_1.Team.findOneById(teamId, { projection: { roomId: 1 } });
            if (!team) {
                throw new Error('invalid-team');
            }
            const room = yield models_1.Rooms.findOneById(team.roomId, { projection: { name: 1 } });
            if (!room) {
                throw new Error('invalid-room');
            }
            const user = yield models_1.Users.findOneById(uid, { projection: { username: 1, name: 1 } });
            if (!user) {
                throw new Error('invalid-user');
            }
            yield core_services_1.Message.saveSystemMessage('user-converted-to-channel', team.roomId, room.name || '', user);
            yield models_1.Rooms.unsetTeamId(teamId);
        });
    }
    updateRoom(uid_1, rid_1, isDefault_1) {
        return __awaiter(this, arguments, void 0, function* (uid, rid, isDefault, canUpdateAnyRoom = false) {
            var _a, e_5, _b, _c;
            if (!rid) {
                throw new Error('missing-roomId');
            }
            if (!uid) {
                throw new Error('missing-userId');
            }
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            const user = yield models_1.Users.findOneById(uid);
            if (!user) {
                throw new Error('invalid-user');
            }
            if (!canUpdateAnyRoom) {
                const canSeeRoom = yield core_services_1.Authorization.canAccessRoom(room, user);
                if (!canSeeRoom) {
                    throw new Error('invalid-room');
                }
            }
            if (!room.teamId) {
                throw new Error('room-not-on-team');
            }
            room.teamDefault = isDefault;
            yield models_1.Rooms.setTeamDefaultById(rid, isDefault);
            if (isDefault) {
                const maxNumberOfAutoJoinMembers = server_2.settings.get('API_User_Limit');
                const teamMembers = yield this.members(uid, room.teamId, true, { offset: 0, count: maxNumberOfAutoJoinMembers }, 
                // We should not get the owner of the room, since he is already a member
                { _id: { $ne: room.u._id } });
                try {
                    for (var _d = true, _e = __asyncValues(teamMembers.records), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const m = _c;
                        if (yield (0, addUserToRoom_1.addUserToRoom)(room._id, m.user, user)) {
                            room.usersCount++;
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
            return Object.assign({}, room);
        });
    }
    listTeamsBySubscriberUserId(uid, options) {
        if (options) {
            return models_1.TeamMember.findByUserId(uid, options).toArray();
        }
        return models_1.TeamMember.findByUserId(uid).toArray();
    }
    listRooms(uid_1, teamId_1, filter_1) {
        return __awaiter(this, arguments, void 0, function* (uid, teamId, filter, { offset: skip, count: limit } = { offset: 0, count: 50 }) {
            if (!teamId) {
                throw new Error('missing-teamId');
            }
            const team = yield models_1.Team.findOneById(teamId, {
                projection: { _id: 1, type: 1 },
            });
            if (!team) {
                throw new Error('invalid-team');
            }
            const { getAllRooms, allowPrivateTeam, name, isDefault } = filter;
            const isMember = yield models_1.TeamMember.findOneByUserIdAndTeamId(uid, teamId);
            if (team.type === core_typings_1.TEAM_TYPE.PRIVATE && !allowPrivateTeam && !isMember) {
                throw new Error('user-not-on-private-team');
            }
            if (getAllRooms) {
                const { cursor, totalCount } = models_1.Rooms.findPaginatedByTeamIdContainingNameAndDefault(teamId, name, isDefault, undefined, {
                    skip,
                    limit,
                });
                const [records, total] = yield Promise.all([cursor.toArray(), totalCount]);
                return {
                    total,
                    records,
                };
            }
            const user = yield models_1.Users.findOneById(uid, {
                projection: { __rooms: 1 },
            });
            const userRooms = user === null || user === void 0 ? void 0 : user.__rooms;
            const { cursor, totalCount } = models_1.Rooms.findPaginatedByTeamIdContainingNameAndDefault(teamId, name, isDefault, userRooms, { skip, limit });
            const [records, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return {
                total,
                records,
            };
        });
    }
    listRoomsOfUser(uid_1, teamId_1, userId_1, allowPrivateTeam_1, showCanDeleteOnly_1) {
        return __awaiter(this, arguments, void 0, function* (uid, teamId, userId, allowPrivateTeam, showCanDeleteOnly, { offset: skip, count: limit } = { offset: 0, count: 50 }) {
            var _a, e_6, _b, _c;
            if (!teamId) {
                throw new Error('missing-teamId');
            }
            const team = yield models_1.Team.findOneById(teamId, {});
            if (!team) {
                throw new Error('invalid-team');
            }
            const isMember = yield models_1.TeamMember.findOneByUserIdAndTeamId(uid, teamId);
            if (team.type === core_typings_1.TEAM_TYPE.PRIVATE && !allowPrivateTeam && !isMember) {
                throw new Error('user-not-on-private-team');
            }
            const teamRooms = yield models_1.Rooms.findByTeamId(teamId, {
                projection: { _id: 1, t: 1 },
            }).toArray();
            let teamRoomIds;
            if (showCanDeleteOnly) {
                const canDeleteTeamChannel = yield core_services_1.Authorization.hasPermission(userId, 'delete-team-channel', team.roomId);
                const canDeleteTeamGroup = yield core_services_1.Authorization.hasPermission(userId, 'delete-team-group', team.roomId);
                try {
                    for (var _d = true, teamRooms_1 = __asyncValues(teamRooms), teamRooms_1_1; teamRooms_1_1 = yield teamRooms_1.next(), _a = teamRooms_1_1.done, !_a; _d = true) {
                        _c = teamRooms_1_1.value;
                        _d = false;
                        const room = _c;
                        const isPublicRoom = room.t === 'c';
                        const canDeleteTeamRoom = isPublicRoom ? canDeleteTeamChannel : canDeleteTeamGroup;
                        const canDeleteRoom = canDeleteTeamRoom && (yield core_services_1.Authorization.hasPermission(userId, isPublicRoom ? 'delete-c' : 'delete-p', room._id));
                        room.userCanDelete = canDeleteRoom;
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = teamRooms_1.return)) yield _b.call(teamRooms_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                teamRoomIds = teamRooms.filter((room) => (room.t === 'c' || room.t === 'p') && room.userCanDelete).map((room) => room._id);
            }
            else {
                teamRoomIds = teamRooms.filter((room) => room.t === 'p' || room.t === 'c').map((room) => room._id);
            }
            const subscriptionsCursor = models_1.Subscriptions.findByUserIdAndRoomIds(userId, teamRoomIds);
            const subscriptionRoomIds = (yield subscriptionsCursor.toArray()).map((subscription) => subscription.rid);
            const { cursor, totalCount } = models_1.Rooms.findPaginatedByIds(subscriptionRoomIds, {
                skip,
                limit,
            });
            const [rooms, total] = yield Promise.all([cursor.toArray(), totalCount]);
            const roomData = yield (0, getRoomsWithSingleOwner_1.getSubscribedRoomsForUserWithDetails)(userId, false, teamRoomIds);
            const records = [];
            for (const room of rooms) {
                const roomInfo = roomData.find((data) => data.rid === room._id);
                if (!roomInfo) {
                    continue;
                }
                room.isLastOwner = roomInfo.userIsLastOwner;
                records.push(room);
            }
            return {
                total,
                records,
            };
        });
    }
    getMatchingTeamRooms(teamId, rids) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!teamId) {
                throw new Error('missing-teamId');
            }
            if (!rids) {
                return [];
            }
            if (!Array.isArray(rids)) {
                throw new Error('invalid-list-of-rooms');
            }
            const rooms = yield models_1.Rooms.findByTeamIdAndRoomsId(teamId, rids, {
                projection: { _id: 1 },
            }).toArray();
            return rooms.map(({ _id }) => _id);
        });
    }
    getMembersByTeamIds(teamIds, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.TeamMember.findByTeamIds(teamIds, options).toArray();
        });
    }
    members(uid_1, teamId_1, canSeeAll_1) {
        return __awaiter(this, arguments, void 0, function* (uid, teamId, canSeeAll, { offset, count } = { offset: 0, count: 50 }, query = {}) {
            var _a, e_7, _b, _c;
            const isMember = yield models_1.TeamMember.findOneByUserIdAndTeamId(uid, teamId);
            if (!isMember && !canSeeAll) {
                return {
                    total: 0,
                    records: [],
                };
            }
            const users = yield models_1.Users.findActive(Object.assign({}, query)).toArray();
            const userIds = users.map((m) => m._id);
            const { cursor, totalCount } = models_1.TeamMember.findPaginatedMembersInfoByTeamId(teamId, count, offset, {
                userId: { $in: userIds },
            });
            const results = [];
            try {
                for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
                    _c = cursor_1_1.value;
                    _d = false;
                    const record = _c;
                    const user = users.find((u) => u._id === record.userId);
                    if (!user) {
                        continue;
                    }
                    results.push({
                        user: {
                            _id: user._id,
                            username: user.username,
                            name: user.name,
                            status: user.status,
                            settings: user.settings,
                        },
                        roles: record.roles,
                        createdBy: {
                            _id: record.createdBy._id,
                            username: record.createdBy.username,
                        },
                        createdAt: record.createdAt,
                    });
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return {
                total: yield totalCount,
                records: results,
            };
        });
    }
    addMembers(uid, teamId, members) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, members_1, members_1_1;
            var _b, e_8, _c, _d;
            const createdBy = (yield models_1.Users.findOneById(uid, { projection: { username: 1 } }));
            if (!createdBy) {
                throw new Error('invalid-user');
            }
            const team = yield models_1.Team.findOneById(teamId, {
                projection: { roomId: 1 },
            });
            if (!team) {
                throw new Error('team-does-not-exist');
            }
            try {
                for (_a = true, members_1 = __asyncValues(members); members_1_1 = yield members_1.next(), _b = members_1_1.done, !_b; _a = true) {
                    _d = members_1_1.value;
                    _a = false;
                    const member = _d;
                    const user = (yield models_1.Users.findOneById(member.userId, { projection: { username: 1 } }));
                    yield (0, addUserToRoom_1.addUserToRoom)(team.roomId, user, createdBy, { skipSystemMessage: false });
                    if (member.roles) {
                        yield this.addRolesToMember(teamId, member.userId, member.roles);
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = members_1.return)) yield _c.call(members_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
        });
    }
    updateMember(teamId, member) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!member.userId) {
                throw new Error('invalid-user');
            }
            const memberUpdate = {
                roles: member.roles ? member.roles : [],
            };
            const team = yield models_1.Team.findOneById(teamId);
            if (!team) {
                throw new Error('invalid-team');
            }
            const responses = yield Promise.all([
                models_1.TeamMember.updateOneByUserIdAndTeamId(member.userId, teamId, memberUpdate),
                models_1.Subscriptions.updateOne({
                    'rid': team === null || team === void 0 ? void 0 : team.roomId,
                    'u._id': member.userId,
                }, {
                    $set: memberUpdate,
                }),
            ]);
            if (responses[1].modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(team.roomId, member.userId);
            }
        });
    }
    removeMember(teamId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.TeamMember.deleteByUserIdAndTeamId(userId, teamId);
        });
    }
    removeMembers(uid, teamId, members) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, members_2, members_2_1;
            var _b, e_9, _c, _d;
            var _e;
            const team = yield models_1.Team.findOneById(teamId, {
                projection: { _id: 1, roomId: 1 },
            });
            if (!team) {
                throw new Error('team-does-not-exist');
            }
            const membersIds = members.map((m) => m.userId);
            const usersToRemove = yield models_1.Users.findByIds(membersIds, {
                projection: { _id: 1, username: 1 },
            }).toArray();
            const byUser = yield models_1.Users.findOneById(uid);
            try {
                for (_a = true, members_2 = __asyncValues(members); members_2_1 = yield members_2.next(), _b = members_2_1.done, !_b; _a = true) {
                    _d = members_2_1.value;
                    _a = false;
                    const member = _d;
                    if (!member.userId) {
                        throw new Error('invalid-user');
                    }
                    const existingMember = yield models_1.TeamMember.findOneByUserIdAndTeamId(member.userId, team._id);
                    const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(team.roomId, member.userId);
                    if (!existingMember && !subscription) {
                        throw new Error('member-does-not-exist');
                    }
                    if (existingMember) {
                        if ((_e = existingMember.roles) === null || _e === void 0 ? void 0 : _e.includes('owner')) {
                            const totalOwners = yield models_1.TeamMember.countByTeamIdAndRole(team._id, 'owner');
                            if (totalOwners === 1) {
                                throw new Error('last-owner-can-not-be-removed');
                            }
                        }
                        yield models_1.TeamMember.removeById(existingMember._id);
                    }
                    const removedUser = usersToRemove.find((u) => u._id === (existingMember || member).userId);
                    if (removedUser) {
                        yield (0, removeUserFromRoom_1.removeUserFromRoom)(team.roomId, removedUser, uid !== member.userId && byUser
                            ? {
                                byUser,
                            }
                            : undefined);
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = members_2.return)) yield _c.call(members_2);
                }
                finally { if (e_9) throw e_9.error; }
            }
            return true;
        });
    }
    insertMemberOnTeams(userId, teamIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const inviter = { _id: 'rocket.cat', username: 'rocket.cat' };
            yield Promise.all(teamIds.map((teamId) => __awaiter(this, void 0, void 0, function* () {
                const team = yield models_1.Team.findOneById(teamId);
                const user = yield models_1.Users.findOneById(userId);
                if (!team || !user) {
                    return;
                }
                yield (0, addUserToRoom_1.addUserToRoom)(team.roomId, user, inviter, { skipSystemMessage: false });
            })));
        });
    }
    removeMemberFromTeams(userId, teamIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(teamIds.map((teamId) => __awaiter(this, void 0, void 0, function* () {
                const team = yield models_1.Team.findOneById(teamId);
                const user = yield models_1.Users.findOneById(userId);
                if (!team || !user) {
                    return;
                }
                yield (0, removeUserFromRoom_1.removeUserFromRoom)(team.roomId, user);
            })));
        });
    }
    removeAllMembersFromTeam(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!teamId) {
                throw new Error('missing-teamId');
            }
            yield models_1.TeamMember.deleteByTeamId(teamId);
        });
    }
    addMember(inviter, userId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAlreadyAMember = yield models_1.TeamMember.findOneByUserIdAndTeamId(userId, teamId, {
                projection: { _id: 1 },
            });
            if (isAlreadyAMember) {
                return false;
            }
            let inviterData = {};
            if (inviter) {
                inviterData = { _id: inviter._id, username: inviter.username };
            }
            yield models_1.TeamMember.createOneByTeamIdAndUserId(teamId, userId, inviterData);
            yield this.addMembersToDefaultRooms(inviter, teamId, [{ userId }]);
            return true;
        });
    }
    getAllPublicTeams(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return options ? models_1.Team.findByType(core_typings_1.TEAM_TYPE.PUBLIC, options).toArray() : models_1.Team.findByType(core_typings_1.TEAM_TYPE.PUBLIC).toArray();
        });
    }
    getOneById(teamId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options === undefined) {
                return models_1.Team.findOneById(teamId);
            }
            return models_1.Team.findOneById(teamId, options);
        });
    }
    getOneByName(teamName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return models_1.Team.findOneByName(teamName);
            }
            return models_1.Team.findOneByName(teamName, options);
        });
    }
    getOneByMainRoomId(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Team.findOneByMainRoomId(roomId, {
                projection: { _id: 1 },
            });
        });
    }
    getOneByRoomId(roomId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findOneById(roomId, { projection: { teamId: 1 } });
            if (!room) {
                throw new Error('invalid-room');
            }
            if (!room.teamId) {
                throw new Error('room-not-on-team');
            }
            return models_1.Team.findOneById(room.teamId, options);
        });
    }
    addRolesToMember(teamId, userId, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMember = yield models_1.TeamMember.findOneByUserIdAndTeamId(userId, teamId, {
                projection: { _id: 1 },
            });
            if (!isMember) {
                // TODO should this throw an error instead?
                return false;
            }
            return !!(yield models_1.TeamMember.updateRolesByTeamIdAndUserId(teamId, userId, roles));
        });
    }
    removeRolesFromMember(teamId, userId, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMember = yield models_1.TeamMember.findOneByUserIdAndTeamId(userId, teamId, {
                projection: { _id: 1 },
            });
            if (!isMember) {
                // TODO should this throw an error instead?
                return false;
            }
            return !!(yield models_1.TeamMember.removeRolesByTeamIdAndUserId(teamId, userId, roles));
        });
    }
    getInfoByName(teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Team.findOne({
                name: teamName,
            }, { projection: { usernames: 0 } });
        });
    }
    getInfoById(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Team.findOne({
                _id: teamId,
            }, { projection: { usernames: 0 } });
        });
    }
    addMembersToDefaultRooms(inviter, teamId, members) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultRooms = yield models_1.Rooms.findDefaultRoomsForTeam(teamId).toArray();
            const users = yield models_1.Users.findActiveByIds(members.map((member) => member.userId)).toArray();
            defaultRooms.map((room) => __awaiter(this, void 0, void 0, function* () {
                var _a, e_10, _b, _c;
                try {
                    // at this point, users are already part of the team so we won't check for membership
                    for (var _d = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _a = users_1_1.done, !_a; _d = true) {
                        _c = users_1_1.value;
                        _d = false;
                        const user = _c;
                        // add each user to the default room
                        yield (0, addUserToRoom_1.addUserToRoom)(room._id, user, inviter, { skipSystemMessage: false });
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = users_1.return)) yield _b.call(users_1);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
            }));
        });
    }
    deleteById(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield models_1.Team.deleteOneById(teamId));
        });
    }
    deleteByName(teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield models_1.Team.deleteOneByName(teamName));
        });
    }
    getStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                totalTeams: yield models_1.Team.estimatedDocumentCount(),
                totalRoomsInsideTeams: yield models_1.Rooms.countRoomsInsideTeams(),
                totalDefaultRoomsInsideTeams: yield models_1.Rooms.countRoomsInsideTeams(true),
            };
        });
    }
    autocomplete(uid, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameRegex = new RegExp(`^${(0, string_helpers_1.escapeRegExp)(name).trim()}`, 'i');
            const subscriptions = yield models_1.Subscriptions.find({ 'u._id': uid }, { projection: { rid: 1 } }).toArray();
            const subscriptionIds = subscriptions.map(({ rid }) => rid);
            const rooms = yield models_1.Rooms.find({
                teamMain: true,
                $and: [
                    {
                        $or: [
                            {
                                name: nameRegex,
                            },
                            {
                                fname: nameRegex,
                            },
                        ],
                    },
                    {
                        $or: [
                            {
                                t: 'c',
                            },
                            {
                                _id: { $in: subscriptionIds },
                            },
                        ],
                    },
                ],
            }, {
                projection: {
                    fname: 1,
                    teamId: 1,
                    name: 1,
                    t: 1,
                    avatarETag: 1,
                },
                limit: 10,
                sort: {
                    name: 1,
                    fname: 1,
                },
            }).toArray();
            return rooms;
        });
    }
    getParentRoom(team) {
        return models_1.Rooms.findOneById(team.roomId, {
            projection: { name: 1, fname: 1, t: 1, sidepanel: 1 },
        });
    }
    getRoomInfo(room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!room.teamId) {
                return {};
            }
            const team = yield models_1.Team.findOneById(room.teamId, { projection: { _id: 1, name: 1, roomId: 1, type: 1 } });
            if (!team) {
                return {};
            }
            if (room.teamMain) {
                return { team };
            }
            const parentRoom = yield this.getParentRoom(team);
            return Object.assign({ team }, (parentRoom && { parentRoom }));
        });
    }
    // Returns the list of rooms and discussions a user has access to inside a team
    // Rooms returned are a composition of the rooms the user is in + public rooms + discussions from the main room (if any)
    listChildren(userId_1, team_1, filter_1, type_1, sort_1) {
        return __awaiter(this, arguments, void 0, function* (userId, team, filter, type, sort, skip = 0, limit = 10) {
            const mainRoom = yield models_1.Rooms.findOneById(team.roomId, { projection: { _id: 1 } });
            if (!mainRoom) {
                throw new Error('error-invalid-team-no-main-room');
            }
            const isMember = yield models_1.TeamMember.findOneByUserIdAndTeamId(userId, team._id, {
                projection: { _id: 1 },
            });
            if (!isMember) {
                throw new Error('error-invalid-team-not-a-member');
            }
            const [{ totalCount: [{ count: total }] = [], paginatedResults: data = [] }] = (yield models_1.Rooms.findChildrenOfTeam(team._id, mainRoom._id, userId, filter, type, { skip, limit, sort }).toArray()) || [];
            return {
                total,
                data,
            };
        });
    }
}
exports.TeamService = TeamService;
