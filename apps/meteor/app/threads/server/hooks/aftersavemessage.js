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
exports.processThreads = processThreads;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const notifyUsersOnMessage_1 = require("../../../lib/server/lib/notifyUsersOnMessage");
const sendNotificationsOnMessage_1 = require("../../../lib/server/lib/sendNotificationsOnMessage");
const server_1 = require("../../../settings/server");
const functions_1 = require("../functions");
function notifyUsersOnReply(message, replies) {
    return __awaiter(this, void 0, void 0, function* () {
        // skips this callback if the message was edited
        if ((0, core_typings_1.isEditedMessage)(message)) {
            return message;
        }
        yield (0, notifyUsersOnMessage_1.updateThreadUsersSubscriptions)(message, replies);
        return message;
    });
}
function metaData(message, parentMessage, followers) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, functions_1.reply)({ tmid: message.tmid }, message, parentMessage, followers);
        return message;
    });
}
const notification = (message, room, replies) => __awaiter(void 0, void 0, void 0, function* () {
    // skips this callback if the message was edited
    if ((0, core_typings_1.isEditedMessage)(message)) {
        return message;
    }
    // will send a notification to everyone who replied/followed the thread except the owner of the message
    yield (0, sendNotificationsOnMessage_1.sendMessageNotifications)(message, room, replies);
    return message;
});
function processThreads(message, room) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!message.tmid) {
            return message;
        }
        const parentMessage = yield models_1.Messages.findOneById(message.tmid);
        if (!parentMessage) {
            return message;
        }
        const { mentionIds } = yield (0, notifyUsersOnMessage_1.getMentions)(message);
        const replies = [
            ...new Set([
                ...((!parentMessage.tcount ? [parentMessage.u._id] : parentMessage.replies) || []),
                ...(!parentMessage.tcount && room.t === 'd' && room.uids ? room.uids : []),
                ...mentionIds,
            ]),
        ].filter((userId) => userId !== message.u._id);
        yield notifyUsersOnReply(message, replies);
        yield metaData(message, parentMessage, replies);
        yield notification(message, room, replies);
        void (0, notifyListener_1.notifyOnMessageChange)({
            id: message.tmid,
        });
        return message;
    });
}
meteor_1.Meteor.startup(() => {
    server_1.settings.watch('Threads_enabled', (value) => {
        if (!value) {
            callbacks_1.callbacks.remove('afterSaveMessage', 'threads-after-save-message');
            return;
        }
        callbacks_1.callbacks.add('afterSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
            return processThreads(message, room);
        }), callbacks_1.callbacks.priority.LOW, 'threads-after-save-message');
    });
});
