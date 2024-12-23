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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const eraseRoom_1 = require("../../../../server/lib/eraseRoom");
const createDirectMessage_1 = require("../../../../server/methods/createDirectMessage");
const hideRoom_1 = require("../../../../server/methods/hideRoom");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const saveRoomSettings_1 = require("../../../channel-settings/server/methods/saveRoomSettings");
const getRoomByNameOrIdWithOptionToJoin_1 = require("../../../lib/server/functions/getRoomByNameOrIdWithOptionToJoin");
const server_1 = require("../../../settings/server");
const normalizeMessagesForUser_1 = require("../../../utils/server/lib/normalizeMessagesForUser");
const api_1 = require("../api");
const addUserToFileObj_1 = require("../helpers/addUserToFileObj");
const composeRoomWithLastMessage_1 = require("../helpers/composeRoomWithLastMessage");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const findDirectMessageRoom = (keys, uid) => __awaiter(void 0, void 0, void 0, function* () {
    if (!('roomId' in keys) && !('username' in keys)) {
        throw new meteor_1.Meteor.Error('error-room-param-not-provided', 'Query param "roomId" or "username" is required');
    }
    const user = yield models_1.Users.findOneById(uid, { projection: { username: 1 } });
    if (!user) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'findDirectMessageRoom',
        });
    }
    const room = yield (0, getRoomByNameOrIdWithOptionToJoin_1.getRoomByNameOrIdWithOptionToJoin)({
        user,
        nameOrId: 'roomId' in keys ? keys.roomId : keys.username,
        type: 'd',
    });
    if (!room || (room === null || room === void 0 ? void 0 : room.t) !== 'd') {
        throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" param provided does not match any direct message');
    }
    const subscription = yield models_1.Subscriptions.findOne({ 'rid': room._id, 'u._id': uid });
    return {
        room,
        subscription,
    };
});
api_1.API.v1.addRoute(['dm.create', 'im.create'], {
    authRequired: true,
    validateParams: rest_typings_1.isDmCreateProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = 'username' in this.bodyParams
                ? [this.bodyParams.username]
                : this.bodyParams.usernames.split(',').map((username) => username.trim());
            const room = yield (0, createDirectMessage_1.createDirectMessage)(users, this.userId, this.bodyParams.excludeSelf);
            return api_1.API.v1.success({
                room: Object.assign(Object.assign({}, room), { _id: room.rid }),
            });
        });
    },
});
api_1.API.v1.addRoute(['dm.delete', 'im.delete'], {
    authRequired: true,
    validateParams: rest_typings_1.isDmDeleteProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { room } = yield findDirectMessageRoom(this.bodyParams, this.userId);
            const canAccess = (yield (0, canAccessRoom_1.canAccessRoomIdAsync)(room._id, this.userId)) || (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-room-administration'));
            if (!canAccess) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
            }
            yield (0, eraseRoom_1.eraseRoom)(room._id, this.userId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute(['dm.close', 'im.close'], { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.bodyParams;
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-room-param-not-provided', 'Body param "roomId" is required');
            }
            let subscription;
            const roomExists = !!(yield models_1.Rooms.findOneById(roomId));
            if (!roomExists) {
                // even if the room doesn't exist, we should allow the user to close the subscription anyways
                subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, this.userId);
            }
            else {
                const canAccess = yield (0, canAccessRoom_1.canAccessRoomIdAsync)(roomId, this.userId);
                if (!canAccess) {
                    return api_1.API.v1.unauthorized();
                }
                const { subscription: subs } = yield findDirectMessageRoom({ roomId }, this.userId);
                subscription = subs;
            }
            if (!subscription) {
                return api_1.API.v1.failure(`The user is not subscribed to the room`);
            }
            if (!subscription.open) {
                return api_1.API.v1.failure(`The direct message room, is already closed to the sender`);
            }
            yield (0, hideRoom_1.hideRoomMethod)(this.userId, roomId);
            return api_1.API.v1.success();
        });
    },
});
// https://github.com/RocketChat/Rocket.Chat/pull/9679 as reference
api_1.API.v1.addRoute(['dm.counters', 'im.counters'], { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const access = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-room-administration');
            const { roomId, userId: ruserId } = this.queryParams;
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-room-param-not-provided', 'Query param "roomId" is required');
            }
            let user = this.userId;
            let unreads = null;
            let userMentions = null;
            let unreadsFrom = null;
            let joined = false;
            let msgs = null;
            let latest = null;
            let members = null;
            let lm = null;
            if (ruserId) {
                if (!access) {
                    return api_1.API.v1.unauthorized();
                }
                user = ruserId;
            }
            const canAccess = yield (0, canAccessRoom_1.canAccessRoomIdAsync)(roomId, user);
            if (!canAccess) {
                return api_1.API.v1.unauthorized();
            }
            const { room, subscription } = yield findDirectMessageRoom({ roomId }, user);
            lm = (room === null || room === void 0 ? void 0 : room.lm) ? new Date(room.lm).toISOString() : new Date(room._updatedAt).toISOString(); // lm is the last message timestamp
            if (subscription) {
                unreads = (_a = subscription.unread) !== null && _a !== void 0 ? _a : null;
                if (subscription.ls && room.msgs) {
                    unreadsFrom = new Date(subscription.ls).toISOString(); // last read timestamp
                }
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
api_1.API.v1.addRoute(['dm.files', 'im.files'], {
    authRequired: true,
    validateParams: rest_typings_1.isDmFileProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const { room } = yield findDirectMessageRoom(this.queryParams, this.userId);
            const canAccess = yield (0, canAccessRoom_1.canAccessRoomIdAsync)(room._id, this.userId);
            if (!canAccess) {
                return api_1.API.v1.unauthorized();
            }
            const ourQuery = query ? Object.assign({ rid: room._id }, query) : { rid: room._id };
            const { cursor, totalCount } = models_1.Uploads.findPaginatedWithoutThumbs(ourQuery, {
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
api_1.API.v1.addRoute(['dm.history', 'im.history'], { authRequired: true, validateParams: rest_typings_1.isDmHistoryProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset = 0, count = 20 } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { roomId, latest, oldest, inclusive, unreads, showThreadMessages } = this.queryParams;
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-room-param-not-provided', 'Query param "roomId" is required');
            }
            const { room } = yield findDirectMessageRoom({ roomId }, this.userId);
            const objectParams = {
                rid: room._id,
                latest: latest ? new Date(latest) : new Date(),
                oldest: oldest && new Date(oldest),
                inclusive: inclusive === 'true',
                offset,
                count,
                unreads: unreads === 'true',
                showThreadMessages: showThreadMessages === 'true',
            };
            const result = yield meteor_1.Meteor.callAsync('getChannelHistory', objectParams);
            if (!result) {
                return api_1.API.v1.unauthorized();
            }
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute(['dm.members', 'im.members'], {
    authRequired: true,
    validateParams: rest_typings_1.isDmMemberProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { room } = yield findDirectMessageRoom(this.queryParams, this.userId);
            const canAccess = yield (0, canAccessRoom_1.canAccessRoomIdAsync)(room._id, this.userId);
            if (!canAccess) {
                return api_1.API.v1.unauthorized();
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                status: check_1.Match.Maybe([String]),
                filter: check_1.Match.Maybe(String),
            }));
            const { status, filter } = this.queryParams;
            const extraQuery = Object.assign({ _id: { $in: room.uids } }, (status && { status: { $in: status } }));
            const canSeeExtension = yield (0, hasPermission_1.hasAtLeastOnePermissionAsync)(this.userId, ['view-full-other-user-info', 'view-user-voip-extension'], room._id);
            const options = {
                projection: Object.assign({ _id: 1, username: 1, name: 1, status: 1, statusText: 1, utcOffset: 1, federated: 1 }, (canSeeExtension && { freeSwitchExtension: 1 })),
                skip: offset,
                limit: count,
                sort: {
                    _updatedAt: -1,
                    username: (sort === null || sort === void 0 ? void 0 : sort.username) ? sort.username : 1,
                },
            };
            const searchFields = server_1.settings.get('Accounts_SearchFields').trim().split(',');
            const { cursor, totalCount } = models_1.Users.findPaginatedByActiveUsersExcept(filter, [], options, searchFields, [extraQuery]);
            const [members, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                members,
                count: members.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute(['dm.messages', 'im.messages'], {
    authRequired: true,
    validateParams: rest_typings_1.isDmMessagesProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { roomId, username, mentionIds, starredIds, pinned } = this.queryParams;
            const { room } = yield findDirectMessageRoom(Object.assign({}, (roomId ? { roomId } : { username })), this.userId);
            const canAccess = yield (0, canAccessRoom_1.canAccessRoomIdAsync)(room._id, this.userId);
            if (!canAccess) {
                return api_1.API.v1.unauthorized();
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const parseIds = (ids, field) => typeof ids === 'string' && ids ? { [field]: { $in: ids.split(',').map((id) => id.trim()) } } : {};
            const ourQuery = Object.assign(Object.assign(Object.assign(Object.assign({ rid: room._id }, query), parseIds(mentionIds, 'mentions._id')), parseIds(starredIds, 'starred._id')), (pinned && pinned.toLowerCase() === 'true' ? { pinned: true } : {}));
            const sortObj = { ts: (_a = sort === null || sort === void 0 ? void 0 : sort.ts) !== null && _a !== void 0 ? _a : -1 };
            const { cursor, totalCount } = models_1.Messages.findPaginated(ourQuery, Object.assign({ sort: sortObj, skip: offset, limit: count }, (fields && { projection: fields })));
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
api_1.API.v1.addRoute(['dm.messages.others', 'im.messages.others'], { authRequired: true, permissionsRequired: ['view-room-administration'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (server_1.settings.get('API_Enable_Direct_Message_History_EndPoint') !== true) {
                throw new meteor_1.Meteor.Error('error-endpoint-disabled', 'This endpoint is disabled', {
                    route: '/api/v1/im.messages.others',
                });
            }
            const { roomId } = this.queryParams;
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-roomid-param-not-provided', 'The parameter "roomId" is required');
            }
            const room = yield models_1.Rooms.findOneById(roomId, { projection: { _id: 1, t: 1 } });
            if (!room || (room === null || room === void 0 ? void 0 : room.t) !== 'd') {
                throw new meteor_1.Meteor.Error('error-room-not-found', `No direct message room found by the id of: ${roomId}`);
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const ourQuery = Object.assign({}, query, { rid: room._id });
            const { cursor, totalCount } = models_1.Messages.findPaginated(ourQuery, {
                sort: sort || { ts: -1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [msgs, total] = yield Promise.all([cursor.toArray(), totalCount]);
            if (!msgs) {
                throw new meteor_1.Meteor.Error('error-no-messages', 'No messages found');
            }
            return api_1.API.v1.success({
                messages: yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(msgs, this.userId),
                offset,
                count: msgs.length,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute(['dm.list', 'im.list'], { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort = { name: 1 }, fields } = yield this.parseJsonQuery();
            // TODO: CACHE: Add Breaking notice since we removed the query param
            const subscriptions = yield models_1.Subscriptions.find({ 'u._id': this.userId, 't': 'd' }, { projection: { rid: 1 } })
                .map((item) => item.rid)
                .toArray();
            const { cursor, totalCount } = models_1.Rooms.findPaginated({ t: 'd', _id: { $in: subscriptions } }, {
                sort,
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [ims, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                ims: yield Promise.all(ims.map((room) => (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId))),
                offset,
                count: ims.length,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute(['dm.list.everyone', 'im.list.everyone'], { authRequired: true, permissionsRequired: ['view-room-administration'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const { cursor, totalCount } = models_1.Rooms.findPaginated(Object.assign(Object.assign({}, query), { t: 'd' }), {
                sort: sort || { name: 1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [rooms, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                ims: yield Promise.all(rooms.map((room) => (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId))),
                offset,
                count: rooms.length,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute(['dm.open', 'im.open'], { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.bodyParams;
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-room-param-not-provided', 'Body param "roomId" is required');
            }
            const canAccess = yield (0, canAccessRoom_1.canAccessRoomIdAsync)(roomId, this.userId);
            if (!canAccess) {
                return api_1.API.v1.unauthorized();
            }
            const { room, subscription } = yield findDirectMessageRoom({ roomId }, this.userId);
            if (!(subscription === null || subscription === void 0 ? void 0 : subscription.open)) {
                yield meteor_1.Meteor.callAsync('openRoom', room._id);
            }
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute(['dm.setTopic', 'im.setTopic'], { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, topic } = this.bodyParams;
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-room-param-not-provided', 'Body param "roomId" is required');
            }
            const canAccess = yield (0, canAccessRoom_1.canAccessRoomIdAsync)(roomId, this.userId);
            if (!canAccess) {
                return api_1.API.v1.unauthorized();
            }
            const { room } = yield findDirectMessageRoom({ roomId }, this.userId);
            yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, room._id, 'roomTopic', topic);
            return api_1.API.v1.success({
                topic,
            });
        });
    },
});
