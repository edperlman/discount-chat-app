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
exports.pinMessage = pinMessage;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const isTruthy_1 = require("../../../lib/isTruthy");
const server_1 = require("../../authorization/server");
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const isTheLastMessage_1 = require("../../lib/server/functions/isTheLastMessage");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const server_2 = require("../../settings/server");
const getUserAvatarURL_1 = require("../../utils/server/getUserAvatarURL");
const recursiveRemove = (msg, deep = 1) => {
    var _a;
    if (!msg || !(0, core_typings_1.isQuoteAttachment)(msg)) {
        return;
    }
    if (deep > ((_a = server_2.settings.get('Message_QuoteChainLimit')) !== null && _a !== void 0 ? _a : 0)) {
        delete msg.attachments;
        return msg;
    }
    msg.attachments = Array.isArray(msg.attachments)
        ? msg.attachments.map((nestedMsg) => recursiveRemove(nestedMsg, deep + 1)).filter(isTruthy_1.isTruthy)
        : undefined;
    return msg;
};
const shouldAdd = (attachments, attachment) => !attachments.some((_attachment) => (0, core_typings_1.isQuoteAttachment)(_attachment) && _attachment.message_link === attachment.message_link);
function pinMessage(originalMessage, userId, pinnedAt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!server_2.settings.get('Message_AllowPinning')) {
            throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {
                method: 'pinMessage',
                action: 'Message_pinning',
            });
        }
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'pin-message', originalMessage.rid))) {
            throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', { method: 'pinMessage' });
        }
        const room = yield models_1.Rooms.findOneById(originalMessage.rid);
        if (!room) {
            throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', { method: 'pinMessage' });
        }
        if (!(yield (0, server_1.canAccessRoomAsync)(room, { _id: userId }))) {
            throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', { method: 'pinMessage' });
        }
        if (originalMessage.pinned) {
            return originalMessage;
        }
        const me = yield models_1.Users.findOneById(userId);
        if (!me) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'pinMessage' });
        }
        originalMessage.pinned = true;
        originalMessage.pinnedAt = pinnedAt || new Date();
        originalMessage.pinnedBy = {
            _id: userId,
            username: me.username,
        };
        originalMessage = yield core_services_1.Message.beforeSave({ message: originalMessage, room, user: me });
        yield models_1.Messages.setPinnedByIdAndUserId(originalMessage._id, originalMessage.pinnedBy, originalMessage.pinned);
        if (server_2.settings.get('Message_Read_Receipt_Store_Users')) {
            yield models_1.ReadReceipts.setPinnedByMessageId(originalMessage._id, originalMessage.pinned);
        }
        if ((0, isTheLastMessage_1.isTheLastMessage)(room, originalMessage)) {
            yield models_1.Rooms.setLastMessagePinned(room._id, originalMessage.pinnedBy, originalMessage.pinned);
        }
        const attachments = [];
        if (Array.isArray(originalMessage.attachments)) {
            originalMessage.attachments.forEach((attachment) => {
                if (!(0, core_typings_1.isQuoteAttachment)(attachment) || shouldAdd(attachments, attachment)) {
                    attachments.push(attachment);
                }
            });
        }
        // App IPostMessagePinned event hook
        yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostMessagePinned, originalMessage, yield meteor_1.Meteor.userAsync(), originalMessage.pinned));
        const pinMessageType = originalMessage.t === 'e2e' ? 'message_pinned_e2e' : 'message_pinned';
        return core_services_1.Message.saveSystemMessage(pinMessageType, originalMessage.rid, '', me, {
            attachments: [
                {
                    text: originalMessage.msg,
                    author_name: originalMessage.u.username,
                    author_icon: (0, getUserAvatarURL_1.getUserAvatarURL)(originalMessage.u.username),
                    ts: originalMessage.ts,
                    attachments: attachments.map(recursiveRemove),
                },
            ],
        });
    });
}
meteor_1.Meteor.methods({
    pinMessage(message, pinnedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(message._id, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'pinMessage',
                });
            }
            const originalMessage = yield models_1.Messages.findOneById(message._id);
            if (!(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.rid)) {
                throw new meteor_1.Meteor.Error('error-invalid-message', 'Message you are pinning was not found', {
                    method: 'pinMessage',
                    action: 'Message_pinning',
                });
            }
            return pinMessage(originalMessage, userId, pinnedAt);
        });
    },
    unpinMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, check_1.check)(message._id, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'unpinMessage',
                });
            }
            if (!server_2.settings.get('Message_AllowPinning')) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {
                    method: 'unpinMessage',
                    action: 'Message_pinning',
                });
            }
            let originalMessage = yield models_1.Messages.findOneById(message._id);
            if (originalMessage == null || originalMessage._id == null) {
                throw new meteor_1.Meteor.Error('error-invalid-message', 'Message you are unpinning was not found', {
                    method: 'unpinMessage',
                    action: 'Message_pinning',
                });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(originalMessage.rid, userId, { projection: { _id: 1 } });
            if (!subscription) {
                // If it's a valid message but on a room that the user is not subscribed to, report that the message was not found.
                throw new meteor_1.Meteor.Error('error-invalid-message', 'Message you are unpinning was not found', {
                    method: 'unpinMessage',
                    action: 'Message_pinning',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'pin-message', originalMessage.rid))) {
                throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', { method: 'unpinMessage' });
            }
            const me = yield models_1.Users.findOneById(userId);
            if (!me) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'unpinMessage' });
            }
            // If we keep history of edits, insert a new message to store history information
            if (server_2.settings.get('Message_KeepHistory') && (0, core_typings_1.isRegisterUser)(me)) {
                yield models_1.Messages.cloneAndSaveAsHistoryById(originalMessage._id, me);
            }
            originalMessage.pinned = false;
            originalMessage.pinnedBy = {
                _id: userId,
                username: me.username,
            };
            const room = yield models_1.Rooms.findOneById(originalMessage.rid, { projection: Object.assign(Object.assign({}, server_1.roomAccessAttributes), { lastMessage: 1 }) });
            if (!room) {
                throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', { method: 'unpinMessage' });
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, { _id: userId }))) {
                throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', { method: 'unpinMessage' });
            }
            originalMessage = yield core_services_1.Message.beforeSave({ message: originalMessage, room, user: me });
            if ((0, isTheLastMessage_1.isTheLastMessage)(room, message)) {
                yield models_1.Rooms.setLastMessagePinned(room._id, originalMessage.pinnedBy, originalMessage.pinned);
                void (0, notifyListener_1.notifyOnRoomChangedById)(room._id);
            }
            // App IPostMessagePinned event hook
            yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostMessagePinned, originalMessage, yield meteor_1.Meteor.userAsync(), originalMessage.pinned));
            yield models_1.Messages.setPinnedByIdAndUserId(originalMessage._id, originalMessage.pinnedBy, originalMessage.pinned);
            if (server_2.settings.get('Message_Read_Receipt_Store_Users')) {
                yield models_1.ReadReceipts.setPinnedByMessageId(originalMessage._id, originalMessage.pinned);
            }
            void (0, notifyListener_1.notifyOnMessageChange)({
                id: message._id,
            });
            return true;
        });
    },
});
