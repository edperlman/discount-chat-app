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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const meteor_1 = require("meteor/meteor");
const reportMessage_1 = require("../../../../server/lib/moderation/reportMessage");
const server_1 = require("../../../authorization/server");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const canSendMessage_1 = require("../../../authorization/server/functions/canSendMessage");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const deleteMessage_1 = require("../../../lib/server/functions/deleteMessage");
const processWebhookMessage_1 = require("../../../lib/server/functions/processWebhookMessage");
const sendMessage_1 = require("../../../lib/server/methods/sendMessage");
const updateMessage_1 = require("../../../lib/server/methods/updateMessage");
const airGappedRestrictionsWrapper_1 = require("../../../license/server/airGappedRestrictionsWrapper");
const pinMessage_1 = require("../../../message-pin/server/pinMessage");
const server_2 = require("../../../oembed/server/server");
const setReaction_1 = require("../../../reactions/server/setReaction");
const server_3 = require("../../../settings/server");
const server_4 = require("../../../ui-utils/server");
const normalizeMessagesForUser_1 = require("../../../utils/server/lib/normalizeMessagesForUser");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const messages_1 = require("../lib/messages");
api_1.API.v1.addRoute('chat.delete', { authRequired: true, validateParams: rest_typings_1.isChatDeleteProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield models_1.Messages.findOneById(this.bodyParams.msgId, { projection: { u: 1, rid: 1 } });
            if (!msg) {
                return api_1.API.v1.failure(`No message found with the id of "${this.bodyParams.msgId}".`);
            }
            if (this.bodyParams.roomId !== msg.rid) {
                return api_1.API.v1.failure('The room id provided does not match where the message is from.');
            }
            if (this.bodyParams.asUser &&
                msg.u._id !== this.userId &&
                !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'force-delete-message', msg.rid))) {
                return api_1.API.v1.failure('Unauthorized. You must have the permission "force-delete-message" to delete other\'s message as them.');
            }
            const userId = this.bodyParams.asUser ? msg.u._id : this.userId;
            const user = yield models_1.Users.findOneById(userId, { projection: { _id: 1 } });
            if (!user) {
                return api_1.API.v1.failure('User not found');
            }
            yield (0, deleteMessage_1.deleteMessageValidatingPermission)(msg, user._id);
            return api_1.API.v1.success({
                _id: msg._id,
                ts: Date.now().toString(),
                message: msg,
            });
        });
    },
});
api_1.API.v1.addRoute('chat.syncMessages', { authRequired: true, validateParams: rest_typings_1.isChatSyncMessagesProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, lastUpdate, count, next, previous, type } = this.queryParams;
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-param-required', 'The required "roomId" query param is missing');
            }
            if (!lastUpdate && !type) {
                throw new meteor_1.Meteor.Error('error-param-required', 'The "type" or "lastUpdate" parameters must be provided');
            }
            if (lastUpdate && isNaN(Date.parse(lastUpdate))) {
                throw new meteor_1.Meteor.Error('error-lastUpdate-param-invalid', 'The "lastUpdate" query parameter must be a valid date');
            }
            const getMessagesQuery = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (lastUpdate && { lastUpdate: new Date(lastUpdate) })), (next && { next })), (previous && { previous })), (count && { count })), (type && { type }));
            const result = yield meteor_1.Meteor.callAsync('messages/get', roomId, getMessagesQuery);
            if (!result) {
                return api_1.API.v1.failure();
            }
            return api_1.API.v1.success({
                result: Object.assign(Object.assign(Object.assign({}, (result.updated && { updated: yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(result.updated, this.userId) })), (result.deleted && { deleted: result.deleted })), (result.cursor && { cursor: result.cursor })),
            });
        });
    },
});
api_1.API.v1.addRoute('chat.getMessage', {
    authRequired: true,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queryParams.msgId) {
                return api_1.API.v1.failure('The "msgId" query parameter must be provided.');
            }
            const msg = yield meteor_1.Meteor.callAsync('getSingleMessage', this.queryParams.msgId);
            if (!msg) {
                return api_1.API.v1.failure();
            }
            const [message] = yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)([msg], this.userId);
            return api_1.API.v1.success({
                message,
            });
        });
    },
});
api_1.API.v1.addRoute('chat.pinMessage', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.messageId) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new meteor_1.Meteor.Error('error-messageid-param-not-provided', 'The required "messageId" param is missing.');
            }
            const msg = yield models_1.Messages.findOneById(this.bodyParams.messageId);
            if (!msg) {
                throw new meteor_1.Meteor.Error('error-message-not-found', 'The provided "messageId" does not match any existing message.');
            }
            const pinnedMessage = yield (0, pinMessage_1.pinMessage)(msg, this.userId);
            const [message] = yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)([pinnedMessage], this.userId);
            return api_1.API.v1.success({
                message,
            });
        });
    },
});
api_1.API.v1.addRoute('chat.postMessage', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { text, attachments } = this.bodyParams;
            const maxAllowedSize = (_a = server_3.settings.get('Message_MaxAllowedSize')) !== null && _a !== void 0 ? _a : 0;
            if (text && text.length > maxAllowedSize) {
                return api_1.API.v1.failure('error-message-size-exceeded');
            }
            if (attachments && attachments.length > 0) {
                for (const attachment of attachments) {
                    if (attachment.text && attachment.text.length > maxAllowedSize) {
                        return api_1.API.v1.failure('error-message-size-exceeded');
                    }
                }
            }
            const messageReturn = (yield (0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(() => (0, processWebhookMessage_1.processWebhookMessage)(this.bodyParams, this.user)))[0];
            if (!messageReturn) {
                return api_1.API.v1.failure('unknown-error');
            }
            const [message] = yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)([messageReturn.message], this.userId);
            return api_1.API.v1.success({
                ts: Date.now(),
                channel: messageReturn.channel,
                message,
            });
        });
    },
});
api_1.API.v1.addRoute('chat.search', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, searchText } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-roomId-param-not-provided', 'The required "roomId" query param is missing.');
            }
            if (!searchText) {
                throw new meteor_1.Meteor.Error('error-searchText-param-not-provided', 'The required "searchText" query param is missing.');
            }
            const result = (yield meteor_1.Meteor.callAsync('messageSearch', searchText, roomId, count, offset)).message.docs;
            return api_1.API.v1.success({
                messages: yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(result, this.userId),
            });
        });
    },
});
// The difference between `chat.postMessage` and `chat.sendMessage` is that `chat.sendMessage` allows
// for passing a value for `_id` and the other one doesn't. Also, `chat.sendMessage` only sends it to
// one channel whereas the other one allows for sending to more than one channel at a time.
api_1.API.v1.addRoute('chat.sendMessage', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bodyParams.message) {
                throw new meteor_1.Meteor.Error('error-invalid-params', 'The "message" parameter must be provided.');
            }
            if (server_4.MessageTypes.isSystemMessage(this.bodyParams.message)) {
                throw new Error("Cannot send system messages using 'chat.sendMessage'");
            }
            const sent = yield (0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(() => (0, sendMessage_1.executeSendMessage)(this.userId, this.bodyParams.message, this.bodyParams.previewUrls));
            const [message] = yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)([sent], this.userId);
            return api_1.API.v1.success({
                message,
            });
        });
    },
});
api_1.API.v1.addRoute('chat.starMessage', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.messageId) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new meteor_1.Meteor.Error('error-messageid-param-not-provided', 'The required "messageId" param is required.');
            }
            const msg = yield models_1.Messages.findOneById(this.bodyParams.messageId);
            if (!msg) {
                throw new meteor_1.Meteor.Error('error-message-not-found', 'The provided "messageId" does not match any existing message.');
            }
            yield meteor_1.Meteor.callAsync('starMessage', {
                _id: msg._id,
                rid: msg.rid,
                starred: true,
            });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('chat.unPinMessage', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.messageId) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new meteor_1.Meteor.Error('error-messageid-param-not-provided', 'The required "messageId" param is required.');
            }
            const msg = yield models_1.Messages.findOneById(this.bodyParams.messageId);
            if (!msg) {
                throw new meteor_1.Meteor.Error('error-message-not-found', 'The provided "messageId" does not match any existing message.');
            }
            yield meteor_1.Meteor.callAsync('unpinMessage', msg);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('chat.unStarMessage', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.messageId) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new meteor_1.Meteor.Error('error-messageid-param-not-provided', 'The required "messageId" param is required.');
            }
            const msg = yield models_1.Messages.findOneById(this.bodyParams.messageId);
            if (!msg) {
                throw new meteor_1.Meteor.Error('error-message-not-found', 'The provided "messageId" does not match any existing message.');
            }
            yield meteor_1.Meteor.callAsync('starMessage', {
                _id: msg._id,
                rid: msg.rid,
                starred: false,
            });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('chat.update', { authRequired: true, validateParams: rest_typings_1.isChatUpdateProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield models_1.Messages.findOneById(this.bodyParams.msgId);
            // Ensure the message exists
            if (!msg) {
                return api_1.API.v1.failure(`No message found with the id of "${this.bodyParams.msgId}".`);
            }
            if (this.bodyParams.roomId !== msg.rid) {
                return api_1.API.v1.failure('The room id provided does not match where the message is from.');
            }
            const msgFromBody = this.bodyParams.text;
            // Permission checks are already done in the updateMessage method, so no need to duplicate them
            yield (0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(() => (0, updateMessage_1.executeUpdateMessage)(this.userId, {
                _id: msg._id,
                msg: msgFromBody,
                rid: msg.rid,
                customFields: this.bodyParams.customFields,
            }, this.bodyParams.previewUrls));
            const updatedMessage = yield models_1.Messages.findOneById(msg._id);
            const [message] = yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(updatedMessage ? [updatedMessage] : [], this.userId);
            return api_1.API.v1.success({
                message,
            });
        });
    },
});
api_1.API.v1.addRoute('chat.react', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.messageId) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new meteor_1.Meteor.Error('error-messageid-param-not-provided', 'The required "messageId" param is missing.');
            }
            const msg = yield models_1.Messages.findOneById(this.bodyParams.messageId);
            if (!msg) {
                throw new meteor_1.Meteor.Error('error-message-not-found', 'The provided "messageId" does not match any existing message.');
            }
            const emoji = 'emoji' in this.bodyParams ? this.bodyParams.emoji : this.bodyParams.reaction;
            if (!emoji) {
                throw new meteor_1.Meteor.Error('error-emoji-param-not-provided', 'The required "emoji" param is missing.');
            }
            yield (0, setReaction_1.executeSetReaction)(this.userId, emoji, msg, this.bodyParams.shouldReact);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('chat.reportMessage', { authRequired: true, validateParams: rest_typings_1.isChatReportMessageProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, description } = this.bodyParams;
            if (!messageId) {
                return api_1.API.v1.failure('The required "messageId" param is missing.');
            }
            if (!description) {
                return api_1.API.v1.failure('The required "description" param is missing.');
            }
            yield (0, reportMessage_1.reportMessage)(messageId, description, this.userId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('chat.ignoreUser', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, userId } = this.queryParams;
            let { ignore = true } = this.queryParams;
            ignore = typeof ignore === 'string' ? /true|1/.test(ignore) : ignore;
            if (!(rid === null || rid === void 0 ? void 0 : rid.trim())) {
                throw new meteor_1.Meteor.Error('error-room-id-param-not-provided', 'The required "rid" param is missing.');
            }
            if (!(userId === null || userId === void 0 ? void 0 : userId.trim())) {
                throw new meteor_1.Meteor.Error('error-user-id-param-not-provided', 'The required "userId" param is missing.');
            }
            yield meteor_1.Meteor.callAsync('ignoreUser', { rid, userId, ignore });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('chat.getDeletedMessages', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, since } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            if (!roomId) {
                throw new meteor_1.Meteor.Error('The required "roomId" query param is missing.');
            }
            if (!since) {
                throw new meteor_1.Meteor.Error('The required "since" query param is missing.');
            }
            else if (isNaN(Date.parse(since))) {
                throw new meteor_1.Meteor.Error('The "since" query parameter must be a valid date.');
            }
            const { cursor, totalCount } = yield models_1.Messages.trashFindPaginatedDeletedAfter(new Date(since), { rid: roomId }, {
                skip: offset,
                limit: count,
                projection: { _id: 1 },
            });
            const [messages, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                messages,
                count: messages.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('chat.getPinnedMessages', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-roomId-param-not-provided', 'The required "roomId" query param is missing.');
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(roomId, this.userId))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
            }
            const { cursor, totalCount } = yield models_1.Messages.findPaginatedPinnedByRoom(roomId, {
                skip: offset,
                limit: count,
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
api_1.API.v1.addRoute('chat.getThreadsList', { authRequired: true, validateParams: rest_typings_1.isChatGetThreadsListProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { rid, type, text } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            if (!server_3.settings.get('Threads_enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Threads Disabled');
            }
            const user = yield models_1.Users.findOneById(this.userId, { projection: { _id: 1 } });
            const room = yield models_1.Rooms.findOneById(rid, { projection: Object.assign(Object.assign({}, server_1.roomAccessAttributes), { t: 1, _id: 1 }) });
            if (!room || !user || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not Allowed');
            }
            const typeThread = Object.assign(Object.assign(Object.assign({ _hidden: { $ne: true } }, (type === 'following' && { replies: { $in: [this.userId] } })), (type === 'unread' && { _id: { $in: ((_a = (yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, user._id))) === null || _a === void 0 ? void 0 : _a.tunread) || [] } })), { msg: new RegExp((0, string_helpers_1.escapeRegExp)(text || ''), 'i') });
            const threadQuery = Object.assign(Object.assign(Object.assign({}, query), typeThread), { rid: room._id, tcount: { $exists: true } });
            const { cursor, totalCount } = yield models_1.Messages.findPaginated(threadQuery, {
                sort: sort || { tlm: -1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [threads, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                threads: yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(threads, this.userId),
                count: threads.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('chat.syncThreadsList', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.queryParams;
            const { query, fields, sort } = yield this.parseJsonQuery();
            const { updatedSince } = this.queryParams;
            let updatedSinceDate;
            if (!server_3.settings.get('Threads_enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Threads Disabled');
            }
            if (!rid) {
                throw new meteor_1.Meteor.Error('error-room-id-param-not-provided', 'The required "rid" query param is missing.');
            }
            if (!updatedSince) {
                throw new meteor_1.Meteor.Error('error-updatedSince-param-invalid', 'The required param "updatedSince" is missing.');
            }
            if (isNaN(Date.parse(updatedSince))) {
                throw new meteor_1.Meteor.Error('error-updatedSince-param-invalid', 'The "updatedSince" query parameter must be a valid date.');
            }
            else {
                updatedSinceDate = new Date(updatedSince);
            }
            const user = yield models_1.Users.findOneById(this.userId, { projection: { _id: 1 } });
            const room = yield models_1.Rooms.findOneById(rid, { projection: Object.assign(Object.assign({}, server_1.roomAccessAttributes), { t: 1, _id: 1 }) });
            if (!room || !user || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not Allowed');
            }
            const threadQuery = Object.assign({}, query, { rid, tcount: { $exists: true } });
            return api_1.API.v1.success({
                threads: {
                    update: yield models_1.Messages.find(Object.assign(Object.assign({}, threadQuery), { _updatedAt: { $gt: updatedSinceDate } }), {
                        sort,
                        projection: fields,
                    }).toArray(),
                    remove: yield models_1.Messages.trashFindDeletedAfter(updatedSinceDate, threadQuery, {
                        sort,
                        projection: fields,
                    }).toArray(),
                },
            });
        });
    },
});
api_1.API.v1.addRoute('chat.getThreadMessages', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tmid } = this.queryParams;
            const { query, fields, sort } = yield this.parseJsonQuery();
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            if (!server_3.settings.get('Threads_enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Threads Disabled');
            }
            if (!tmid) {
                throw new meteor_1.Meteor.Error('error-invalid-params', 'The required "tmid" query param is missing.');
            }
            const thread = yield models_1.Messages.findOneById(tmid, { projection: { rid: 1 } });
            if (!(thread === null || thread === void 0 ? void 0 : thread.rid)) {
                throw new meteor_1.Meteor.Error('error-invalid-message', 'Invalid Message');
            }
            const user = yield models_1.Users.findOneById(this.userId, { projection: { _id: 1 } });
            const room = yield models_1.Rooms.findOneById(thread.rid, { projection: Object.assign(Object.assign({}, server_1.roomAccessAttributes), { t: 1, _id: 1 }) });
            if (!room || !user || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not Allowed');
            }
            const { cursor, totalCount } = yield models_1.Messages.findPaginated(Object.assign(Object.assign({}, query), { tmid }), {
                sort: sort || { ts: 1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [messages, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                messages,
                count: messages.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('chat.syncThreadMessages', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tmid } = this.queryParams;
            const { query, fields, sort } = yield this.parseJsonQuery();
            const { updatedSince } = this.queryParams;
            let updatedSinceDate;
            if (!server_3.settings.get('Threads_enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Threads Disabled');
            }
            if (!tmid) {
                throw new meteor_1.Meteor.Error('error-invalid-params', 'The required "tmid" query param is missing.');
            }
            if (!updatedSince) {
                throw new meteor_1.Meteor.Error('error-updatedSince-param-invalid', 'The required param "updatedSince" is missing.');
            }
            if (isNaN(Date.parse(updatedSince))) {
                throw new meteor_1.Meteor.Error('error-updatedSince-param-invalid', 'The "updatedSince" query parameter must be a valid date.');
            }
            else {
                updatedSinceDate = new Date(updatedSince);
            }
            const thread = yield models_1.Messages.findOneById(tmid, { projection: { rid: 1 } });
            if (!(thread === null || thread === void 0 ? void 0 : thread.rid)) {
                throw new meteor_1.Meteor.Error('error-invalid-message', 'Invalid Message');
            }
            const user = yield models_1.Users.findOneById(this.userId, { projection: { _id: 1 } });
            const room = yield models_1.Rooms.findOneById(thread.rid, { projection: Object.assign(Object.assign({}, server_1.roomAccessAttributes), { t: 1, _id: 1 }) });
            if (!room || !user || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not Allowed');
            }
            return api_1.API.v1.success({
                messages: {
                    update: yield models_1.Messages.find(Object.assign(Object.assign({}, query), { tmid, _updatedAt: { $gt: updatedSinceDate } }), { projection: fields, sort }).toArray(),
                    remove: yield models_1.Messages.trashFindDeletedAfter(updatedSinceDate, Object.assign(Object.assign({}, query), { tmid }), { projection: fields, sort }).toArray(),
                },
            });
        });
    },
});
api_1.API.v1.addRoute('chat.followMessage', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { mid } = this.bodyParams;
            if (!mid) {
                throw new meteor_1.Meteor.Error('The required "mid" body param is missing.');
            }
            yield meteor_1.Meteor.callAsync('followMessage', { mid });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('chat.unfollowMessage', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { mid } = this.bodyParams;
            if (!mid) {
                throw new meteor_1.Meteor.Error('The required "mid" body param is missing.');
            }
            yield meteor_1.Meteor.callAsync('unfollowMessage', { mid });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('chat.getMentionedMessages', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.queryParams;
            const { sort } = yield this.parseJsonQuery();
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-invalid-params', 'The required "roomId" query param is missing.');
            }
            const messages = yield (0, messages_1.findMentionedMessages)({
                uid: this.userId,
                roomId,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return api_1.API.v1.success(messages);
        });
    },
});
api_1.API.v1.addRoute('chat.getStarredMessages', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.queryParams;
            const { sort } = yield this.parseJsonQuery();
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-invalid-params', 'The required "roomId" query param is missing.');
            }
            const messages = yield (0, messages_1.findStarredMessages)({
                uid: this.userId,
                roomId,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            messages.messages = yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(messages.messages, this.userId);
            return api_1.API.v1.success(messages);
        });
    },
});
api_1.API.v1.addRoute('chat.getDiscussions', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, text } = this.queryParams;
            const { sort } = yield this.parseJsonQuery();
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-invalid-params', 'The required "roomId" query param is missing.');
            }
            const messages = yield (0, messages_1.findDiscussionsFromRoom)({
                uid: this.userId,
                roomId,
                text: text || '',
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return api_1.API.v1.success(messages);
        });
    },
});
api_1.API.v1.addRoute('chat.otr', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, type: otrType } = this.bodyParams;
            if (!roomId) {
                throw new meteor_1.Meteor.Error('error-invalid-params', 'The required "roomId" query param is missing.');
            }
            if (!otrType) {
                throw new meteor_1.Meteor.Error('error-invalid-params', 'The required "type" query param is missing.');
            }
            const { username, type } = this.user;
            if (!username) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user');
            }
            yield (0, canSendMessage_1.canSendMessageAsync)(roomId, { uid: this.userId, username, type });
            yield core_services_1.Message.saveSystemMessage(otrType, roomId, username, { _id: this.userId, username });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('chat.getURLPreview', { authRequired: true, validateParams: rest_typings_1.isChatGetURLPreviewProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, url } = this.queryParams;
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(roomId, this.userId))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
            }
            const { urlPreview } = yield server_2.OEmbed.parseUrl(url);
            urlPreview.ignoreParse = true;
            return api_1.API.v1.success({ urlPreview });
        });
    },
});
