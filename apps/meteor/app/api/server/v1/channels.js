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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const isTruthy_1 = require("../../../../lib/isTruthy");
const eraseRoom_1 = require("../../../../server/lib/eraseRoom");
const findUsersOfRoom_1 = require("../../../../server/lib/findUsersOfRoom");
const hideRoom_1 = require("../../../../server/methods/hideRoom");
const removeUserFromRoom_1 = require("../../../../server/methods/removeUserFromRoom");
const server_1 = require("../../../authorization/server");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const saveRoomSettings_1 = require("../../../channel-settings/server/methods/saveRoomSettings");
const mountQueriesBasedOnPermission_1 = require("../../../integrations/server/lib/mountQueriesBasedOnPermission");
const addUsersToRoom_1 = require("../../../lib/server/methods/addUsersToRoom");
const createChannel_1 = require("../../../lib/server/methods/createChannel");
const leaveRoom_1 = require("../../../lib/server/methods/leaveRoom");
const server_2 = require("../../../settings/server");
const normalizeMessagesForUser_1 = require("../../../utils/server/lib/normalizeMessagesForUser");
const api_1 = require("../api");
const addUserToFileObj_1 = require("../helpers/addUserToFileObj");
const composeRoomWithLastMessage_1 = require("../helpers/composeRoomWithLastMessage");
const getLoggedInUser_1 = require("../helpers/getLoggedInUser");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const getUserFromParams_1 = require("../helpers/getUserFromParams");
// Returns the channel IF found otherwise it will return the failure of why it didn't. Check the `statusCode` property
function findChannelByIdOrName(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params, checkedArchived = true, userId, }) {
        const projection = Object.assign({}, api_1.API.v1.defaultFieldsToExclude);
        let room;
        if ('roomId' in params) {
            room = yield models_1.Rooms.findOneById(params.roomId || '', { projection });
        }
        else if ('roomName' in params) {
            room = yield models_1.Rooms.findOneByName(params.roomName || '', { projection });
        }
        if (!room || (room.t !== 'c' && room.t !== 'l')) {
            throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any channel');
        }
        if (checkedArchived && room.archived) {
            throw new meteor_1.Meteor.Error('error-room-archived', `The channel, ${room.name}, is archived`);
        }
        if (userId && room.lastMessage) {
            const [lastMessage] = yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)([room.lastMessage], userId);
            room.lastMessage = lastMessage;
        }
        return room;
    });
}
api_1.API.v1.addRoute('channels.addAll', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsAddAllProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = this.bodyParams, { activeUsersOnly } = _a, params = __rest(_a, ["activeUsersOnly"]);
            const findResult = yield findChannelByIdOrName({ params, userId: this.userId });
            yield meteor_1.Meteor.callAsync('addAllUserToRoom', findResult._id, activeUsersOnly);
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({ params, userId: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.archive', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsArchiveProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            yield meteor_1.Meteor.callAsync('archiveRoom', findResult._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.unarchive', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsUnarchiveProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({
                params: this.bodyParams,
                checkedArchived: false,
            });
            if (!findResult.archived) {
                return api_1.API.v1.failure(`The channel, ${findResult.name}, is not archived`);
            }
            yield meteor_1.Meteor.callAsync('unarchiveRoom', findResult._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.history', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsHistoryProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = this.queryParams, { unreads, oldest, latest, showThreadMessages, inclusive } = _a, params = __rest(_a, ["unreads", "oldest", "latest", "showThreadMessages", "inclusive"]);
            const findResult = yield findChannelByIdOrName({
                params,
                checkedArchived: false,
            });
            const { count = 20, offset = 0 } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const result = yield meteor_1.Meteor.callAsync('getChannelHistory', {
                rid: findResult._id,
                latest: latest ? new Date(latest) : new Date(),
                oldest: oldest && new Date(oldest),
                inclusive: inclusive === 'true',
                offset,
                count,
                unreads: unreads === 'true',
                showThreadMessages: showThreadMessages === 'true',
            });
            if (!result) {
                return api_1.API.v1.unauthorized();
            }
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('channels.roles', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsRolesProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.queryParams });
            const roles = yield meteor_1.Meteor.callAsync('getRoomRoles', findResult._id);
            return api_1.API.v1.success({
                roles,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.join', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsJoinProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = this.bodyParams, { joinCode } = _a, params = __rest(_a, ["joinCode"]);
            const findResult = yield findChannelByIdOrName({ params });
            yield core_services_1.Room.join({ room: findResult, user: this.user, joinCode });
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({ params, userId: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.kick', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsKickProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = __rest(this.bodyParams, []) /* userId */;
            const findResult = yield findChannelByIdOrName({ params });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                return api_1.API.v1.failure('Invalid user');
            }
            yield (0, removeUserFromRoom_1.removeUserFromRoomMethod)(this.userId, { rid: findResult._id, username: user.username });
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({ params, userId: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.leave', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsLeaveProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = __rest(this.bodyParams, []);
            const findResult = yield findChannelByIdOrName({ params });
            const user = yield models_1.Users.findOneById(this.userId);
            if (!user) {
                return api_1.API.v1.failure('Invalid user');
            }
            yield (0, leaveRoom_1.leaveRoomMethod)(user, findResult._id);
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({ params, userId: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.messages', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsMessagesProps,
    permissionsRequired: ['view-c-room'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, mentionIds, starredIds, pinned } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const findResult = yield findChannelByIdOrName({
                params: { roomId },
                checkedArchived: false,
            });
            const parseIds = (ids, field) => typeof ids === 'string' && ids ? { [field]: { $in: ids.split(',').map((id) => id.trim()) } } : {};
            const ourQuery = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, query), { rid: findResult._id }), parseIds(mentionIds, 'mentions._id')), parseIds(starredIds, 'starred._id')), (pinned && pinned.toLowerCase() === 'true' ? { pinned: true } : {}));
            // Special check for the permissions
            if ((yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-joined-room')) &&
                !(yield models_1.Subscriptions.findOneByRoomIdAndUserId(findResult._id, this.userId, { projection: { _id: 1 } }))) {
                return api_1.API.v1.unauthorized();
            }
            const { cursor, totalCount } = models_1.Messages.findPaginated(ourQuery, {
                sort: sort || { ts: -1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [messages, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                messages: yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(messages, this.userId),
                count: messages.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.open', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsOpenProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = __rest(this.bodyParams, []);
            const findResult = yield findChannelByIdOrName({
                params,
                checkedArchived: false,
            });
            const sub = yield models_1.Subscriptions.findOneByRoomIdAndUserId(findResult._id, this.userId);
            if (!sub) {
                return api_1.API.v1.failure(`The user/callee is not in the channel "${findResult.name}".`);
            }
            if (sub.open) {
                return api_1.API.v1.failure(`The channel, ${findResult.name}, is already open to the sender`);
            }
            yield meteor_1.Meteor.callAsync('openRoom', findResult._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.setReadOnly', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsSetReadOnlyProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            if (findResult.ro === this.bodyParams.readOnly) {
                return api_1.API.v1.failure('The channel read only setting is the same as what it would be changed to.');
            }
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'readOnly', this.bodyParams.readOnly);
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({ params: this.bodyParams, userId: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.setAnnouncement', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsSetAnnouncementProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = this.bodyParams, { announcement } = _a, params = __rest(_a, ["announcement"]);
            const findResult = yield findChannelByIdOrName({ params });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'roomAnnouncement', announcement);
            return api_1.API.v1.success({
                announcement: this.bodyParams.announcement,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.getAllUserMentionsByChannel', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsGetAllUserMentionsByChannelProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const mentions = yield meteor_1.Meteor.callAsync('getUserMentionsByChannel', {
                roomId,
                options: {
                    sort: sort || { ts: 1 },
                    skip: offset,
                    limit: count,
                },
            });
            const allMentions = yield meteor_1.Meteor.callAsync('getUserMentionsByChannel', {
                roomId,
                options: {},
            });
            return api_1.API.v1.success({
                mentions,
                count: mentions.length,
                offset,
                total: allMentions.length,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.moderators', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsModeratorsProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = __rest(this.queryParams, []);
            const findResult = yield findChannelByIdOrName({ params });
            const moderators = (yield models_1.Subscriptions.findByRoomIdAndRoles(findResult._id, ['moderator'], {
                projection: { u: 1 },
            }).toArray()).map((sub) => sub.u);
            return api_1.API.v1.success({
                moderators,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.delete', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsDeleteProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield findChannelByIdOrName({
                params: this.bodyParams,
                checkedArchived: false,
            });
            yield (0, eraseRoom_1.eraseRoom)(room._id, this.userId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.convertToTeam', {
    authRequired: true,
    validateParams: rest_typings_1.isChannelsConvertToTeamProps,
    permissionsRequired: ['create-team'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { channelId, channelName } = this.bodyParams;
            if (!channelId && !channelName) {
                return api_1.API.v1.failure('The parameter "channelId" or "channelName" is required');
            }
            if (channelId && !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-room', channelId))) {
                return api_1.API.v1.unauthorized();
            }
            const room = yield findChannelByIdOrName({
                params: channelId !== undefined ? { roomId: channelId } : { roomName: channelName },
                userId: this.userId,
            });
            if (!room) {
                return api_1.API.v1.failure('Channel not found');
            }
            const subscriptions = yield models_1.Subscriptions.findByRoomId(room._id, {
                projection: { 'u._id': 1 },
            });
            const members = (yield subscriptions.toArray()).map((s) => { var _a; return (_a = s.u) === null || _a === void 0 ? void 0 : _a._id; });
            const teamData = {
                team: {
                    name: (_a = room.name) !== null && _a !== void 0 ? _a : '',
                    type: room.t === 'c' ? 0 : 1,
                },
                members,
                room: {
                    name: room.name,
                    id: room._id,
                },
            };
            const team = yield core_services_1.Team.create(this.userId, teamData);
            return api_1.API.v1.success({ team });
        });
    },
});
api_1.API.v1.addRoute('channels.addModerator', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('addRoomModerator', findResult._id, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.addOwner', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('addRoomOwner', findResult._id, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.close', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({
                params: this.bodyParams,
                checkedArchived: false,
            });
            const sub = yield models_1.Subscriptions.findOneByRoomIdAndUserId(findResult._id, this.userId);
            if (!sub) {
                return api_1.API.v1.failure(`The user/callee is not in the channel "${findResult.name}.`);
            }
            if (!sub.open) {
                return api_1.API.v1.failure(`The channel, ${findResult.name}, is already closed to the sender`);
            }
            yield (0, hideRoom_1.hideRoomMethod)(this.userId, findResult._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.counters', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const access = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-room-administration');
            const { userId } = this.queryParams;
            let user = this.userId;
            let unreads = null;
            let userMentions = null;
            let unreadsFrom = null;
            let joined = false;
            let msgs = null;
            let latest = null;
            let members = null;
            if (userId) {
                if (!access) {
                    return api_1.API.v1.unauthorized();
                }
                user = userId;
            }
            const room = yield findChannelByIdOrName({
                params: this.queryParams,
            });
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, user);
            const lm = room.lm ? room.lm : room._updatedAt;
            if (subscription === null || subscription === void 0 ? void 0 : subscription.open) {
                unreads = yield models_1.Messages.countVisibleByRoomIdBetweenTimestampsInclusive(subscription.rid, subscription.ls, lm);
                unreadsFrom = subscription.ls || subscription.ts;
                userMentions = subscription.userMentions;
                joined = true;
            }
            if (access || joined) {
                msgs = room.msgs;
                latest = lm;
                members = room.usersCount;
            }
            return api_1.API.v1.success({
                joined,
                members,
                unreads,
                unreadsFrom,
                msgs,
                latest,
                userMentions,
            });
        });
    },
});
function createChannelValidator(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const teamId = (_a = params.teamId) === null || _a === void 0 ? void 0 : _a.value;
        const team = teamId && (yield core_services_1.Team.getInfoById(teamId));
        if ((!teamId && !(yield (0, hasPermission_1.hasPermissionAsync)(params.user.value, 'create-c'))) ||
            (teamId && team && !(yield (0, hasPermission_1.hasPermissionAsync)(params.user.value, 'create-team-channel', team.roomId)))) {
            throw new Error('unauthorized');
        }
        if (!((_b = params.name) === null || _b === void 0 ? void 0 : _b.value)) {
            throw new Error(`Param "${(_c = params.name) === null || _c === void 0 ? void 0 : _c.key}" is required`);
        }
        if (((_d = params.members) === null || _d === void 0 ? void 0 : _d.value) && !Array.isArray(params.members.value)) {
            throw new Error(`Param "${params.members.key}" must be an array if provided`);
        }
        if (((_e = params.customFields) === null || _e === void 0 ? void 0 : _e.value) && !(typeof params.customFields.value === 'object')) {
            throw new Error(`Param "${params.customFields.key}" must be an object if provided`);
        }
        if (((_f = params.teams) === null || _f === void 0 ? void 0 : _f.value) && !Array.isArray(params.teams.value)) {
            throw new Error(`Param ${params.teams.key} must be an array`);
        }
    });
}
function createChannel(userId, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const readOnly = typeof params.readOnly !== 'undefined' ? params.readOnly : false;
        const id = yield (0, createChannel_1.createChannelMethod)(userId, params.name || '', params.members ? params.members : [], readOnly, params.customFields, params.extraData, params.excludeSelf);
        return {
            channel: yield findChannelByIdOrName({ params: { roomId: id.rid }, userId }),
        };
    });
}
api_1.API.channels = {
    create: {
        validate: createChannelValidator,
        execute: createChannel,
    },
};
api_1.API.v1.addRoute('channels.create', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { userId, bodyParams } = this;
            let error;
            try {
                yield ((_a = api_1.API.channels) === null || _a === void 0 ? void 0 : _a.create.validate({
                    user: {
                        value: userId,
                    },
                    name: {
                        value: bodyParams.name,
                        key: 'name',
                    },
                    members: {
                        value: bodyParams.members,
                        key: 'members',
                    },
                    teams: {
                        value: bodyParams.teams,
                        key: 'teams',
                    },
                    teamId: {
                        value: (_b = bodyParams.extraData) === null || _b === void 0 ? void 0 : _b.teamId,
                        key: 'teamId',
                    },
                }));
            }
            catch (e) {
                if (e.message === 'unauthorized') {
                    error = api_1.API.v1.unauthorized();
                }
                else {
                    error = api_1.API.v1.failure(e.message);
                }
            }
            if (error) {
                return error;
            }
            if (bodyParams.teams) {
                const canSeeAllTeams = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-teams');
                const teams = yield core_services_1.Team.listByNames(bodyParams.teams, { projection: { _id: 1 } });
                const teamMembers = [];
                for (const team of teams) {
                    // eslint-disable-next-line no-await-in-loop
                    const { records: members } = yield core_services_1.Team.members(this.userId, team._id, canSeeAllTeams, {
                        offset: 0,
                        count: Number.MAX_SAFE_INTEGER,
                    });
                    const uids = members.map((member) => member.user.username);
                    teamMembers.push(...uids);
                }
                const membersToAdd = new Set([...teamMembers, ...(bodyParams.members || [])]);
                bodyParams.members = [...membersToAdd].filter(Boolean);
            }
            return api_1.API.v1.success(yield ((_c = api_1.API.channels) === null || _c === void 0 ? void 0 : _c.create.execute(userId, bodyParams)));
        });
    },
});
api_1.API.v1.addRoute('channels.files', { authRequired: true, validateParams: rest_typings_1.isChannelsFilesListProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { typeGroup, name, roomId, roomName } = this.queryParams;
            const findResult = yield findChannelByIdOrName({
                params: Object.assign(Object.assign({}, (roomId ? { roomId } : {})), (roomName ? { roomName } : {})),
                checkedArchived: false,
            });
            if (!(yield (0, server_1.canAccessRoomAsync)(findResult, { _id: this.userId }))) {
                return api_1.API.v1.unauthorized();
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const filter = Object.assign(Object.assign(Object.assign({ rid: findResult._id }, query), (name ? { name: { $regex: name || '', $options: 'i' } } : {})), (typeGroup ? { typeGroup } : {}));
            const { cursor, totalCount } = yield models_1.Uploads.findPaginatedWithoutThumbs(filter, {
                sort: sort || { name: 1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [files, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                files: yield (0, addUserToFileObj_1.addUserToFileObj)(files),
                count: files.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.getIntegrations', {
    authRequired: true,
    permissionsRequired: {
        GET: {
            permissions: [
                'manage-outgoing-integrations',
                'manage-own-outgoing-integrations',
                'manage-incoming-integrations',
                'manage-own-incoming-integrations',
            ],
            operation: 'hasAny',
        },
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({
                params: this.queryParams,
                checkedArchived: false,
            });
            let includeAllPublicChannels = true;
            if (typeof this.queryParams.includeAllPublicChannels !== 'undefined') {
                includeAllPublicChannels = this.queryParams.includeAllPublicChannels === 'true';
            }
            let ourQuery = {
                channel: `#${findResult.name}`,
            };
            if (includeAllPublicChannels) {
                ourQuery.channel = {
                    $in: [ourQuery.channel, 'all_public_channels'],
                };
            }
            const params = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(params);
            const { sort, fields: projection, query } = yield this.parseJsonQuery();
            ourQuery = Object.assign(yield (0, mountQueriesBasedOnPermission_1.mountIntegrationQueryBasedOnPermissions)(this.userId), query, ourQuery);
            const { cursor, totalCount } = yield models_1.Integrations.findPaginated(ourQuery, {
                sort: sort || { _createdAt: 1 },
                skip: offset,
                limit: count,
                projection,
            });
            const [integrations, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                integrations,
                count: integrations.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.info', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({
                    params: this.queryParams,
                    checkedArchived: false,
                    userId: this.userId,
                }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.invite', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            const users = yield (0, getUserFromParams_1.getUserListFromParams)(this.bodyParams);
            if (!users.length) {
                return api_1.API.v1.failure('invalid-user-invite-list', 'Cannot invite if no users are provided');
            }
            yield (0, addUsersToRoom_1.addUsersToRoomMethod)(this.userId, { rid: findResult._id, users: users.map((u) => u.username).filter(isTruthy_1.isTruthy) });
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({ params: this.bodyParams, userId: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.list', {
    authRequired: true,
    permissionsRequired: {
        GET: { permissions: ['view-c-room', 'view-joined-room'], operation: 'hasAny' },
    },
    validateParams: rest_typings_1.isChannelsListProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const hasPermissionToSeeAllPublicChannels = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-c-room');
            const { _id } = this.queryParams;
            const ourQuery = Object.assign(Object.assign(Object.assign({}, query), (_id ? { _id } : {})), { t: 'c' });
            if (!hasPermissionToSeeAllPublicChannels) {
                const roomIds = (yield models_1.Subscriptions.findByUserIdAndType(this.userId, 'c', {
                    projection: { rid: 1 },
                }).toArray()).map((s) => s.rid);
                ourQuery._id = { $in: roomIds };
            }
            // teams filter - I would love to have a way to apply this filter @ db level :(
            const ids = (yield models_1.Subscriptions.findByUserId(this.userId, { projection: { rid: 1 } }).toArray()).map((item) => item.rid);
            ourQuery.$or = [
                {
                    teamId: {
                        $exists: false,
                    },
                },
                {
                    teamId: {
                        $exists: true,
                    },
                    _id: {
                        $in: ids,
                    },
                },
            ];
            const { cursor, totalCount } = yield models_1.Rooms.findPaginated(ourQuery, {
                sort: sort || { name: 1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [channels, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                channels: yield Promise.all(channels.map((room) => (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId))),
                count: channels.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.list.joined', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields } = yield this.parseJsonQuery();
            const subs = yield models_1.Subscriptions.findByUserIdAndTypes(this.userId, ['c'], { projection: { rid: 1 } }).toArray();
            const rids = subs.map(({ rid }) => rid).filter(Boolean);
            if (rids.length === 0) {
                return api_1.API.v1.success({
                    channels: [],
                    offset,
                    count: 0,
                    total: 0,
                });
            }
            const { cursor, totalCount } = yield models_1.Rooms.findPaginatedByTypeAndIds('c', rids, {
                sort: sort || { name: 1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [channels, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                channels: yield Promise.all(channels.map((room) => (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId))),
                offset,
                count: channels.length,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.members', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({
                params: this.queryParams,
                checkedArchived: false,
            });
            if (findResult.broadcast && !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-broadcast-member-list', findResult._id))) {
                return api_1.API.v1.unauthorized();
            }
            const { offset: skip, count: limit } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort = {} } = yield this.parseJsonQuery();
            check(this.queryParams, Match.ObjectIncluding({
                status: Match.Maybe([String]),
                filter: Match.Maybe(String),
            }));
            const { status, filter } = this.queryParams;
            const { cursor, totalCount } = yield (0, findUsersOfRoom_1.findUsersOfRoom)(Object.assign(Object.assign(Object.assign({ rid: findResult._id }, (status && { status: { $in: status } })), { skip,
                limit,
                filter }), ((sort === null || sort === void 0 ? void 0 : sort.username) && { sort: { username: sort.username } })));
            const [members, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                members,
                count: members.length,
                offset: skip,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('channels.online', { authRequired: true, validateParams: rest_typings_1.isChannelsOnlineProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = yield this.parseJsonQuery();
            const { _id } = this.queryParams;
            if ((!query || Object.keys(query).length === 0) && !_id) {
                return api_1.API.v1.failure('Invalid query');
            }
            const filter = Object.assign(Object.assign(Object.assign({}, query), (_id ? { _id } : {})), { t: 'c' });
            const room = yield models_1.Rooms.findOne(filter);
            if (!room) {
                return api_1.API.v1.failure('Channel does not exists');
            }
            const user = yield (0, getLoggedInUser_1.getLoggedInUser)(this.request);
            if (!room || !user || !(yield (0, server_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not Allowed');
            }
            const online = yield models_1.Users.findUsersNotOffline({
                projection: { username: 1 },
            }).toArray();
            const onlineInRoom = yield Promise.all(online.map((user) => __awaiter(this, void 0, void 0, function* () {
                const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, user._id, {
                    projection: { _id: 1, username: 1 },
                });
                if (subscription) {
                    return {
                        _id: user._id,
                        username: user.username,
                    };
                }
            })));
            return api_1.API.v1.success({
                online: onlineInRoom.filter(Boolean),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.removeModerator', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('removeRoomModerator', findResult._id, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.removeOwner', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('removeRoomOwner', findResult._id, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.rename', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.name) === null || _a === void 0 ? void 0 : _a.trim())) {
                return api_1.API.v1.failure('The bodyParam "name" is required');
            }
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            if (findResult.name === this.bodyParams.name) {
                return api_1.API.v1.failure('The channel name is the same as what it would be renamed to.');
            }
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'roomName', this.bodyParams.name);
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({
                    params: this.bodyParams,
                    userId: this.userId,
                }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.setCustomFields', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.customFields || !(typeof this.bodyParams.customFields === 'object')) {
                return api_1.API.v1.failure('The bodyParam "customFields" is required with a type like object.');
            }
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'roomCustomFields', this.bodyParams.customFields);
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({ params: this.bodyParams, userId: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.setDefault', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.bodyParams.default === 'undefined') {
                return api_1.API.v1.failure('The bodyParam "default" is required', 'error-channels-setdefault-is-same');
            }
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            if (findResult.default === this.bodyParams.default) {
                return api_1.API.v1.failure('The channel default setting is the same as what it would be changed to.', 'error-channels-setdefault-missing-default-param');
            }
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'default', ['true', '1'].includes(this.bodyParams.default.toString().toLowerCase()));
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({ params: this.bodyParams, userId: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.setDescription', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.hasOwnProperty('description')) {
                return api_1.API.v1.failure('The bodyParam "description" is required');
            }
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            if (findResult.description === this.bodyParams.description) {
                return api_1.API.v1.failure('The channel description is the same as what it would be changed to.');
            }
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'roomDescription', this.bodyParams.description || '');
            return api_1.API.v1.success({
                description: this.bodyParams.description || '',
            });
        });
    },
});
api_1.API.v1.addRoute('channels.setPurpose', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.hasOwnProperty('purpose')) {
                return api_1.API.v1.failure('The bodyParam "purpose" is required');
            }
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            if (findResult.description === this.bodyParams.purpose) {
                return api_1.API.v1.failure('The channel purpose (description) is the same as what it would be changed to.');
            }
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'roomDescription', this.bodyParams.purpose || '');
            return api_1.API.v1.success({
                purpose: this.bodyParams.purpose || '',
            });
        });
    },
});
api_1.API.v1.addRoute('channels.setTopic', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.hasOwnProperty('topic')) {
                return api_1.API.v1.failure('The bodyParam "topic" is required');
            }
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            if (findResult.topic === this.bodyParams.topic) {
                return api_1.API.v1.failure('The channel topic is the same as what it would be changed to.');
            }
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'roomTopic', this.bodyParams.topic || '');
            return api_1.API.v1.success({
                topic: this.bodyParams.topic || '',
            });
        });
    },
});
api_1.API.v1.addRoute('channels.setType', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.type) === null || _a === void 0 ? void 0 : _a.trim())) {
                return api_1.API.v1.failure('The bodyParam "type" is required');
            }
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            if (findResult.t === this.bodyParams.type) {
                return api_1.API.v1.failure('The channel type is the same as what it would be changed to.');
            }
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'roomType', this.bodyParams.type);
            const room = yield models_1.Rooms.findOneById(findResult._id, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                return api_1.API.v1.failure('The channel does not exist');
            }
            return api_1.API.v1.success({
                channel: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.addLeader', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('addRoomLeader', findResult._id, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.removeLeader', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('removeRoomLeader', findResult._id, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('channels.setJoinCode', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.joinCode) === null || _a === void 0 ? void 0 : _a.trim())) {
                return api_1.API.v1.failure('The bodyParam "joinCode" is required');
            }
            const findResult = yield findChannelByIdOrName({ params: this.bodyParams });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult._id, 'joinCode', this.bodyParams.joinCode);
            return api_1.API.v1.success({
                channel: yield findChannelByIdOrName({ params: this.bodyParams, userId: this.userId }),
            });
        });
    },
});
api_1.API.v1.addRoute('channels.anonymousread', { authRequired: false }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findChannelByIdOrName({
                params: this.queryParams,
                checkedArchived: false,
            });
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const ourQuery = Object.assign({}, query, { rid: findResult._id });
            if (!server_2.settings.get('Accounts_AllowAnonymousRead')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Enable "Allow Anonymous Read"', {
                    method: 'channels.anonymousread',
                });
            }
            const { cursor, totalCount } = yield models_1.Messages.findPaginated(ourQuery, {
                sort: sort || { ts: -1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [messages, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                messages: yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(messages, this.userId || ''),
                count: messages.length,
                offset,
                total,
            });
        });
    },
});
