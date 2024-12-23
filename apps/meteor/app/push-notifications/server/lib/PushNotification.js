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
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../assets/server");
const notifications_1 = require("../../../lib/server/functions/notifications");
const mobile_1 = require("../../../lib/server/functions/notifications/mobile");
const server_2 = require("../../../metrics/server");
const server_3 = require("../../../push/server");
const server_4 = require("../../../settings/server");
function hash(str) {
    let hash = 0;
    let i = str.length;
    while (i) {
        hash = (hash << 5) - hash + str.charCodeAt(--i);
        hash &= hash; // Convert to 32bit integer
    }
    return hash;
}
class PushNotification {
    getNotificationId(roomId) {
        const serverId = server_4.settings.get('uniqueID');
        return hash(`${serverId}|${roomId}`); // hash
    }
    getNotificationConfig({ rid, uid: userId, mid: messageId, roomName, username, message, payload, badge = 1, category, idOnly = false, }) {
        const title = idOnly ? '' : roomName || username;
        // message is being redacted already by 'getPushData' if idOnly is true
        const text = !idOnly && roomName !== '' ? `${username}: ${message}` : message;
        return Object.assign({ from: 'push', badge, sound: 'default', priority: 10, title,
            text, payload: Object.assign({ host: meteor_1.Meteor.absoluteUrl(), messageId, notificationType: idOnly ? 'message-id-only' : 'message' }, (!idOnly && Object.assign({ rid }, payload))), userId, notId: this.getNotificationId(rid), gcm: {
                style: 'inbox',
                image: server_1.RocketChatAssets.getURL('Assets_favicon_192'),
            } }, (category !== '' ? { apn: { category } } : {}));
    }
    send(_a) {
        return __awaiter(this, arguments, void 0, function* ({ rid, uid, mid, roomName, username, message, payload, badge = 1, category }) {
            const idOnly = server_4.settings.get('Push_request_content_from_server');
            const config = this.getNotificationConfig({
                rid,
                uid,
                mid,
                roomName,
                username,
                message,
                payload,
                badge,
                category,
                idOnly,
            });
            server_2.metrics.notificationsSent.inc({ notification_type: 'mobile' });
            yield server_3.Push.send(config);
        });
    }
    getNotificationForMessageId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ receiver, message, room, }) {
            const sender = yield models_1.Users.findOneById(message.u._id, { projection: { username: 1, name: 1 } });
            if (!sender) {
                throw new Error('Message sender not found');
            }
            let notificationMessage = yield callbacks_1.callbacks.run('beforeSendMessageNotifications', message.msg);
            if (message.mentions && Object.keys(message.mentions).length > 0 && server_4.settings.get('UI_Use_Real_Name')) {
                notificationMessage = (0, notifications_1.replaceMentionedUsernamesWithFullNames)(message.msg, message.mentions);
            }
            notificationMessage = yield (0, notifications_1.parseMessageTextPerUser)(notificationMessage, message, receiver);
            const pushData = yield (0, mobile_1.getPushData)({
                room,
                message,
                userId: receiver._id,
                receiver,
                senderUsername: sender.username,
                senderName: sender.name,
                notificationMessage,
                shouldOmitMessage: false,
            });
            return {
                message,
                notification: this.getNotificationConfig(Object.assign(Object.assign({}, pushData), { rid: message.rid, uid: message.u._id, mid: message._id, idOnly: false })),
            };
        });
    }
}
exports.default = new PushNotification();
