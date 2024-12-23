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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const eraseRoom_1 = require("../../../../server/lib/eraseRoom");
const findUsersOfRoom_1 = require("../../../../server/lib/findUsersOfRoom");
const hideRoom_1 = require("../../../../server/methods/hideRoom");
const removeUserFromRoom_1 = require("../../../../server/methods/removeUserFromRoom");
const server_1 = require("../../../authorization/server");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const saveRoomSettings_1 = require("../../../channel-settings/server/methods/saveRoomSettings");
const mountQueriesBasedOnPermission_1 = require("../../../integrations/server/lib/mountQueriesBasedOnPermission");
const createPrivateGroup_1 = require("../../../lib/server/methods/createPrivateGroup");
const leaveRoom_1 = require("../../../lib/server/methods/leaveRoom");
const normalizeMessagesForUser_1 = require("../../../utils/server/lib/normalizeMessagesForUser");
const api_1 = require("../api");
const addUserToFileObj_1 = require("../helpers/addUserToFileObj");
const composeRoomWithLastMessage_1 = require("../helpers/composeRoomWithLastMessage");
const getLoggedInUser_1 = require("../helpers/getLoggedInUser");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const getUserFromParams_1 = require("../helpers/getUserFromParams");
function getRoomFromParams(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((!('roomId' in params) && !('roomName' in params)) ||
            ('roomId' in params && !params.roomId && 'roomName' in params && !params.roomName)) {
            throw new meteor_1.Meteor.Error('error-room-param-not-provided', 'The parameter "roomId" or "roomName" is required');
        }
        const roomOptions = {
            projection: Object.assign(Object.assign({}, server_1.roomAccessAttributes), { t: 1, ro: 1, name: 1, fname: 1, prid: 1, archived: 1, broadcast: 1 }),
        };
        const room = yield (() => {
            if ('roomId' in params) {
                return models_1.Rooms.findOneById(params.roomId || '', roomOptions);
            }
            if ('roomName' in params) {
                return models_1.Rooms.findOneByName(params.roomName || '', roomOptions);
            }
        })();
        if (!room || room.t !== 'p') {
            throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
        }
        return room;
    });
}
// Returns the private group subscription IF found otherwise it will return the failure of why it didn't. Check the `statusCode` property
function findPrivateGroupByIdOrName(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params, checkedArchived = true, userId, }) {
        const room = yield getRoomFromParams(params);
        const user = yield models_1.Users.findOneById(userId, { projections: { username: 1 } });
        if (!room || !user || !(yield (0, server_1.canAccessRoomAsync)(room, user))) {
            throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
        }
        // discussions have their names saved on `fname` property
        const roomName = room.prid ? room.fname : room.name;
        if (checkedArchived && room.archived) {
            throw new meteor_1.Meteor.Error('error-room-archived', `The private group, ${roomName}, is archived`);
        }
        const sub = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, userId, { projection: { open: 1 } });
        return {
            rid: room._id,
            open: Boolean(sub === null || sub === void 0 ? void 0 : sub.open),
            ro: Boolean(room.ro),
            t: room.t,
            name: roomName !== null && roomName !== void 0 ? roomName : '',
            broadcast: Boolean(room.broadcast),
        };
    });
}
api_1.API.v1.addRoute('groups.addAll', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = this.bodyParams, { activeUsersOnly } = _a, params = __rest(_a, ["activeUsersOnly"]);
            const findResult = yield findPrivateGroupByIdOrName({
                params,
                userId: this.userId,
            });
            yield meteor_1.Meteor.callAsync('addAllUserToRoom', findResult.rid, this.bodyParams.activeUsersOnly);
            const room = yield models_1.Rooms.findOneById(findResult.rid, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            return api_1.API.v1.success({
                group: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
            });
        });
    },
});
api_1.API.v1.addRoute('groups.addModerator', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('addRoomModerator', findResult.rid, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.addOwner', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('addRoomOwner', findResult.rid, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.addLeader', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('addRoomLeader', findResult.rid, user._id);
            return api_1.API.v1.success();
        });
    },
});
// Archives a private group only if it wasn't
api_1.API.v1.addRoute('groups.archive', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            yield meteor_1.Meteor.callAsync('archiveRoom', findResult.rid);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.close', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
                checkedArchived: false,
            });
            if (!findResult.open) {
                return api_1.API.v1.failure(`The private group, ${findResult.name}, is already closed to the sender`);
            }
            yield (0, hideRoom_1.hideRoomMethod)(this.userId, findResult.rid);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.counters', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const access = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-room-administration');
            const params = this.queryParams;
            let user = this.userId;
            let room;
            let unreads = null;
            let userMentions = null;
            let unreadsFrom = null;
            let joined = false;
            let msgs = null;
            let latest = null;
            let members = null;
            if (('roomId' in params && !params.roomId) || ('roomName' in params && !params.roomName)) {
                throw new meteor_1.Meteor.Error('error-room-param-not-provided', 'The parameter "roomId" or "roomName" is required');
            }
            if ('roomId' in params) {
                room = yield models_1.Rooms.findOneById(params.roomId || '');
            }
            else if ('roomName' in params) {
                room = yield models_1.Rooms.findOneByName(params.roomName || '');
            }
            if (!room || room.t !== 'p') {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            if (room.archived) {
                throw new meteor_1.Meteor.Error('error-room-archived', `The private group, ${room.name}, is archived`);
            }
            if (params.userId) {
                if (!access) {
                    return api_1.API.v1.unauthorized();
                }
                user = params.userId;
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, user);
            const lm = room.lm ? room.lm : room._updatedAt;
            if (subscription === null || subscription === void 0 ? void 0 : subscription.open) {
                unreads = yield models_1.Messages.countVisibleByRoomIdBetweenTimestampsInclusive(subscription.rid, subscription.ls || subscription.ts, lm);
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
// Create Private Group
api_1.API.v1.addRoute('groups.create', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.bodyParams.name) {
                return api_1.API.v1.failure('Body param "name" is required');
            }
            if (this.bodyParams.members && !Array.isArray(this.bodyParams.members)) {
                return api_1.API.v1.failure('Body param "members" must be an array if provided');
            }
            if (this.bodyParams.customFields && !(typeof this.bodyParams.customFields === 'object')) {
                return api_1.API.v1.failure('Body param "customFields" must be an object if provided');
            }
            if (this.bodyParams.extraData && !(typeof this.bodyParams.extraData === 'object')) {
                return api_1.API.v1.failure('Body param "extraData" must be an object if provided');
            }
            const readOnly = typeof this.bodyParams.readOnly !== 'undefined' ? this.bodyParams.readOnly : false;
            try {
                const result = yield (0, createPrivateGroup_1.createPrivateGroupMethod)(this.user, this.bodyParams.name, this.bodyParams.members ? this.bodyParams.members : [], readOnly, this.bodyParams.customFields, this.bodyParams.extraData, (_a = this.bodyParams.excludeSelf) !== null && _a !== void 0 ? _a : false);
                const room = yield models_1.Rooms.findOneById(result.rid, { projection: api_1.API.v1.defaultFieldsToExclude });
                if (!room) {
                    throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
                }
                return api_1.API.v1.success({
                    group: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
                });
            }
            catch (error) {
                if ((0, core_services_1.isMeteorError)(error) && error.reason === 'error-not-allowed') {
                    return api_1.API.v1.unauthorized();
                }
                throw error;
            }
        });
    },
});
api_1.API.v1.addRoute('groups.delete', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
                checkedArchived: false,
            });
            yield (0, eraseRoom_1.eraseRoom)(findResult.rid, this.userId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.files', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.queryParams,
                userId: this.userId,
                checkedArchived: false,
            });
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const ourQuery = Object.assign({}, query, { rid: findResult.rid });
            const { cursor, totalCount } = yield models_1.Uploads.findPaginatedWithoutThumbs(ourQuery, {
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
api_1.API.v1.addRoute('groups.getIntegrations', {
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
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.queryParams,
                userId: this.userId,
                checkedArchived: false,
            });
            let includeAllPrivateGroups = true;
            if (this.queryParams.includeAllPrivateGroups) {
                includeAllPrivateGroups = this.queryParams.includeAllPrivateGroups === 'true';
            }
            const channelsToSearch = [`#${findResult.name}`];
            if (includeAllPrivateGroups) {
                channelsToSearch.push('all_private_groups');
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields: projection, query } = yield this.parseJsonQuery();
            const ourQuery = Object.assign(yield (0, mountQueriesBasedOnPermission_1.mountIntegrationQueryBasedOnPermissions)(this.userId), query, {
                channel: { $in: channelsToSearch },
            });
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
api_1.API.v1.addRoute('groups.history', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.queryParams,
                userId: this.userId,
                checkedArchived: false,
            });
            let latestDate = new Date();
            if (this.queryParams.latest) {
                latestDate = new Date(this.queryParams.latest);
            }
            let oldestDate = undefined;
            if (this.queryParams.oldest) {
                oldestDate = new Date(this.queryParams.oldest);
            }
            const inclusive = this.queryParams.inclusive || false;
            let count = 20;
            if (this.queryParams.count) {
                count = parseInt(String(this.queryParams.count));
            }
            let offset = 0;
            if (this.queryParams.offset) {
                offset = parseInt(String(this.queryParams.offset));
            }
            const unreads = this.queryParams.unreads || false;
            const showThreadMessages = this.queryParams.showThreadMessages !== 'false';
            const result = yield meteor_1.Meteor.callAsync('getChannelHistory', {
                rid: findResult.rid,
                latest: latestDate,
                oldest: oldestDate,
                inclusive,
                offset,
                count,
                unreads,
                showThreadMessages,
            });
            if (!result) {
                return api_1.API.v1.unauthorized();
            }
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('groups.info', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.queryParams,
                userId: this.userId,
                checkedArchived: false,
            });
            const room = yield models_1.Rooms.findOneById(findResult.rid, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            return api_1.API.v1.success({
                group: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
            });
        });
    },
});
api_1.API.v1.addRoute('groups.invite', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const roomId = 'roomId' in this.bodyParams ? this.bodyParams.roomId : '';
            const roomName = 'roomName' in this.bodyParams ? this.bodyParams.roomName : '';
            const idOrName = roomId || roomName;
            if (!(idOrName === null || idOrName === void 0 ? void 0 : idOrName.trim())) {
                throw new meteor_1.Meteor.Error('error-room-param-not-provided', 'The parameter "roomId" or "roomName" is required');
            }
            const { _id: rid, t: type } = (yield models_1.Rooms.findOneByIdOrName(idOrName)) || {};
            if (!rid || type !== 'p') {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            const users = yield (0, getUserFromParams_1.getUserListFromParams)(this.bodyParams);
            if (!users.length) {
                throw new meteor_1.Meteor.Error('error-empty-invite-list', 'Cannot invite if no valid users are provided');
            }
            yield meteor_1.Meteor.callAsync('addUsersToRoom', { rid, users: users.map((u) => u.username) });
            const room = yield models_1.Rooms.findOneById(rid, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            return api_1.API.v1.success({
                group: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
            });
        });
    },
});
api_1.API.v1.addRoute('groups.kick', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield getRoomFromParams(this.bodyParams);
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                return api_1.API.v1.failure('Invalid user');
            }
            yield (0, removeUserFromRoom_1.removeUserFromRoomMethod)(this.userId, { rid: room._id, username: user.username });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.leave', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            const user = yield models_1.Users.findOneById(this.userId);
            if (!user) {
                return api_1.API.v1.failure('Invalid user');
            }
            yield (0, leaveRoom_1.leaveRoomMethod)(user, findResult.rid);
            return api_1.API.v1.success();
        });
    },
});
// List Private Groups a user has access to
api_1.API.v1.addRoute('groups.list', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields } = yield this.parseJsonQuery();
            const subs = yield models_1.Subscriptions.findByUserIdAndTypes(this.userId, ['p'], { projection: { rid: 1 } }).toArray();
            const rids = subs.map(({ rid }) => rid).filter(Boolean);
            if (rids.length === 0) {
                return api_1.API.v1.success({
                    groups: [],
                    offset,
                    count: 0,
                    total: 0,
                });
            }
            const { cursor, totalCount } = yield models_1.Rooms.findPaginatedByTypeAndIds('p', rids, {
                sort: sort || { name: 1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [groups, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                groups: yield Promise.all(groups.map((room) => (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId))),
                offset,
                count: groups.length,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('groups.listAll', { authRequired: true, permissionsRequired: ['view-room-administration'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const ourQuery = Object.assign({}, query, { t: 'p' });
            const { cursor, totalCount } = yield models_1.Rooms.findPaginated(ourQuery, {
                sort: sort || { name: 1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [rooms, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                groups: yield Promise.all(rooms.map((room) => (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId))),
                offset,
                count: rooms.length,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('groups.members', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.queryParams,
                userId: this.userId,
            });
            if (findResult.broadcast && !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-broadcast-member-list', findResult.rid))) {
                return api_1.API.v1.unauthorized();
            }
            const { offset: skip, count: limit } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort = {} } = yield this.parseJsonQuery();
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                status: check_1.Match.Maybe([String]),
                filter: check_1.Match.Maybe(String),
            }));
            const { status, filter } = this.queryParams;
            const { cursor, totalCount } = yield (0, findUsersOfRoom_1.findUsersOfRoom)(Object.assign(Object.assign(Object.assign({ rid: findResult.rid }, (status && { status: { $in: status } })), { skip,
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
api_1.API.v1.addRoute('groups.messages', { authRequired: true, validateParams: rest_typings_1.isGroupsMessagesProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, mentionIds, starredIds, pinned } = this.queryParams;
            const findResult = yield findPrivateGroupByIdOrName({
                params: { roomId },
                userId: this.userId,
            });
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const parseIds = (ids, field) => typeof ids === 'string' && ids ? { [field]: { $in: ids.split(',').map((id) => id.trim()) } } : {};
            const ourQuery = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, query), { rid: findResult.rid }), parseIds(mentionIds, 'mentions._id')), parseIds(starredIds, 'starred._id')), (pinned && pinned.toLowerCase() === 'true' ? { pinned: true } : {}));
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
// TODO: CACHE: same as channels.online
api_1.API.v1.addRoute('groups.online', { authRequired: true, validateParams: rest_typings_1.isGroupsOnlineProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = yield this.parseJsonQuery();
            const { _id } = this.queryParams;
            if ((!query || Object.keys(query).length === 0) && !_id) {
                return api_1.API.v1.failure('Invalid query');
            }
            const filter = Object.assign(Object.assign(Object.assign({}, query), (_id ? { _id } : {})), { t: 'p' });
            const room = yield models_1.Rooms.findOne(filter);
            if (!room) {
                return api_1.API.v1.failure('Group does not exists');
            }
            const user = yield (0, getLoggedInUser_1.getLoggedInUser)(this.request);
            if (!user) {
                return api_1.API.v1.failure('User does not exists');
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not Allowed');
            }
            const online = yield models_1.Users.findUsersNotOffline({
                projection: {
                    username: 1,
                },
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
api_1.API.v1.addRoute('groups.open', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
                checkedArchived: false,
            });
            if (findResult.open) {
                return api_1.API.v1.failure(`The private group, ${findResult.name}, is already open for the sender`);
            }
            yield meteor_1.Meteor.callAsync('openRoom', findResult.rid);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.removeModerator', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('removeRoomModerator', findResult.rid, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.removeOwner', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('removeRoomOwner', findResult.rid, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.removeLeader', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            yield meteor_1.Meteor.callAsync('removeRoomLeader', findResult.rid, user._id);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.rename', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.name) === null || _a === void 0 ? void 0 : _a.trim())) {
                return api_1.API.v1.failure('The bodyParam "name" is required');
            }
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult.rid, 'roomName', this.bodyParams.name);
            const room = yield models_1.Rooms.findOneById(findResult.rid, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            return api_1.API.v1.success({
                group: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
            });
        });
    },
});
api_1.API.v1.addRoute('groups.setCustomFields', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.customFields || !(typeof this.bodyParams.customFields === 'object')) {
                return api_1.API.v1.failure('The bodyParam "customFields" is required with a type like object.');
            }
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult.rid, 'roomCustomFields', this.bodyParams.customFields);
            const room = yield models_1.Rooms.findOneById(findResult.rid, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            return api_1.API.v1.success({
                group: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
            });
        });
    },
});
api_1.API.v1.addRoute('groups.setDescription', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.hasOwnProperty('description')) {
                return api_1.API.v1.failure('The bodyParam "description" is required');
            }
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult.rid, 'roomDescription', this.bodyParams.description || '');
            return api_1.API.v1.success({
                description: this.bodyParams.description || '',
            });
        });
    },
});
api_1.API.v1.addRoute('groups.setPurpose', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.hasOwnProperty('purpose')) {
                return api_1.API.v1.failure('The bodyParam "purpose" is required');
            }
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult.rid, 'roomDescription', this.bodyParams.purpose || '');
            return api_1.API.v1.success({
                purpose: this.bodyParams.purpose || '',
            });
        });
    },
});
api_1.API.v1.addRoute('groups.setReadOnly', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.bodyParams.readOnly === 'undefined') {
                return api_1.API.v1.failure('The bodyParam "readOnly" is required');
            }
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            if (findResult.ro === this.bodyParams.readOnly) {
                return api_1.API.v1.failure('The private group read only setting is the same as what it would be changed to.');
            }
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult.rid, 'readOnly', this.bodyParams.readOnly);
            const room = yield models_1.Rooms.findOneById(findResult.rid, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            return api_1.API.v1.success({
                group: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
            });
        });
    },
});
api_1.API.v1.addRoute('groups.setTopic', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.hasOwnProperty('topic')) {
                return api_1.API.v1.failure('The bodyParam "topic" is required');
            }
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult.rid, 'roomTopic', this.bodyParams.topic || '');
            return api_1.API.v1.success({
                topic: this.bodyParams.topic || '',
            });
        });
    },
});
api_1.API.v1.addRoute('groups.setType', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.type) === null || _a === void 0 ? void 0 : _a.trim())) {
                return api_1.API.v1.failure('The bodyParam "type" is required');
            }
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            if (findResult.t === this.bodyParams.type) {
                return api_1.API.v1.failure('The private group type is the same as what it would be changed to.');
            }
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult.rid, 'roomType', this.bodyParams.type);
            const room = yield models_1.Rooms.findOneById(findResult.rid, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            return api_1.API.v1.success({
                group: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
            });
        });
    },
});
api_1.API.v1.addRoute('groups.setAnnouncement', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.hasOwnProperty('announcement')) {
                return api_1.API.v1.failure('The bodyParam "announcement" is required');
            }
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult.rid, 'roomAnnouncement', this.bodyParams.announcement || '');
            return api_1.API.v1.success({
                announcement: this.bodyParams.announcement || '',
            });
        });
    },
});
api_1.API.v1.addRoute('groups.unarchive', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
                checkedArchived: false,
            });
            yield meteor_1.Meteor.callAsync('unarchiveRoom', findResult.rid);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('groups.roles', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.queryParams,
                userId: this.userId,
            });
            const roles = yield meteor_1.Meteor.callAsync('getRoomRoles', findResult.rid);
            return api_1.API.v1.success({
                roles,
            });
        });
    },
});
api_1.API.v1.addRoute('groups.moderators', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const findResult = yield findPrivateGroupByIdOrName({
                params: this.queryParams,
                userId: this.userId,
            });
            const moderators = (yield models_1.Subscriptions.findByRoomIdAndRoles(findResult.rid, ['moderator'], {
                projection: { u: 1 },
            }).toArray()).map((sub) => sub.u);
            return api_1.API.v1.success({
                moderators,
            });
        });
    },
});
api_1.API.v1.addRoute('groups.setEncrypted', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!check_1.Match.test(this.bodyParams, check_1.Match.ObjectIncluding({ encrypted: Boolean }))) {
                return api_1.API.v1.failure('The bodyParam "encrypted" is required');
            }
            const _a = this.bodyParams, { encrypted } = _a, params = __rest(_a, ["encrypted"]);
            const findResult = yield findPrivateGroupByIdOrName({
                params,
                userId: this.userId,
            });
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, findResult.rid, 'encrypted', encrypted);
            const room = yield models_1.Rooms.findOneById(findResult.rid, { projection: api_1.API.v1.defaultFieldsToExclude });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
            }
            return api_1.API.v1.success({
                group: yield (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId),
            });
        });
    },
});
api_1.API.v1.addRoute('groups.convertToTeam', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (('roomId' in this.bodyParams && !this.bodyParams.roomId) || ('roomName' in this.bodyParams && !this.bodyParams.roomName)) {
                return api_1.API.v1.failure('The parameter "roomId" or "roomName" is required');
            }
            const room = yield findPrivateGroupByIdOrName({
                params: this.bodyParams,
                userId: this.userId,
            });
            if (!room) {
                return api_1.API.v1.failure('Private group not found');
            }
            if (!(yield (0, hasPermission_1.hasAllPermissionAsync)(this.userId, ['create-team', 'edit-room'], room.rid))) {
                return api_1.API.v1.unauthorized();
            }
            const subscriptions = yield models_1.Subscriptions.findByRoomId(room.rid, {
                projection: { 'u._id': 1 },
            }).toArray();
            const members = subscriptions.map((s) => { var _a; return (_a = s.u) === null || _a === void 0 ? void 0 : _a._id; });
            const teamData = {
                team: {
                    name: room.name,
                    type: 1,
                },
                members,
                room: {
                    name: room.name,
                    id: room.rid,
                },
            };
            const team = yield core_services_1.Team.create(this.userId, teamData);
            return api_1.API.v1.success({ team });
        });
    },
});
