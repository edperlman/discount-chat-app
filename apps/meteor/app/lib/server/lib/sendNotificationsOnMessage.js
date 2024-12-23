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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
exports.sendMessageNotifications = sendMessageNotifications;
exports.sendAllNotifications = sendAllNotifications;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const emojione_1 = __importDefault(require("emojione"));
const moment_1 = __importDefault(require("moment"));
const notifyUsersOnMessage_1 = require("./notifyUsersOnMessage");
const callbacks_1 = require("../../../../lib/callbacks");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const NotificationQueue_1 = require("../../../notification-queue/server/NotificationQueue");
const server_1 = require("../../../settings/server");
const notifications_1 = require("../functions/notifications");
const desktop_1 = require("../functions/notifications/desktop");
const email_1 = require("../functions/notifications/email");
const messageContainsHighlight_1 = require("../functions/notifications/messageContainsHighlight");
const mobile_1 = require("../functions/notifications/mobile");
const sendNotification = (_a) => __awaiter(void 0, [_a], void 0, function* ({ subscription, sender, hasReplyToThread, hasMentionToAll, hasMentionToHere, message, notificationMessage, room, mentionIds, disableAllMessageNotifications, }) {
    var _b, e_1, _c, _d;
    var _e, _f, _g, _h, _j;
    if (server_1.settings.get('Troubleshoot_Disable_Notifications') === true) {
        return;
    }
    // don't notify the sender
    if (subscription.u._id === sender._id) {
        return;
    }
    const hasMentionToUser = mentionIds.includes(subscription.u._id);
    // mute group notifications (@here and @all) if not directly mentioned as well
    if (!hasMentionToUser && !hasReplyToThread && subscription.muteGroupMentions && (hasMentionToAll || hasMentionToHere)) {
        return;
    }
    if (!subscription.receiver) {
        subscription.receiver = [
            yield models_1.Users.findOneById(subscription.u._id, {
                projection: {
                    'active': 1,
                    'emails': 1,
                    'language': 1,
                    'status': 1,
                    'statusConnection': 1,
                    'username': 1,
                    'settings.preferences.enableMobileRinging': 1,
                },
            }),
        ];
    }
    const [receiver] = subscription.receiver;
    if (!receiver) {
        throw new Error('receiver not found');
    }
    const roomType = room.t;
    // If the user doesn't have permission to view direct messages, don't send notification of direct messages.
    if (roomType === 'd' && !(yield (0, hasPermission_1.hasPermissionAsync)(subscription.u._id, 'view-d-room'))) {
        return;
    }
    const isThread = !!message.tmid && !message.tshow;
    const isVideoConf = message.t === 'videoconf';
    notificationMessage = yield (0, notifications_1.parseMessageTextPerUser)(notificationMessage, message, receiver);
    const isHighlighted = (0, messageContainsHighlight_1.messageContainsHighlight)(message, subscription.userHighlights);
    const { desktopNotifications, mobilePushNotifications, emailNotifications } = subscription;
    // busy users don't receive desktop notification
    if ((0, desktop_1.shouldNotifyDesktop)({
        disableAllMessageNotifications,
        status: (_e = receiver.status) !== null && _e !== void 0 ? _e : 'offline',
        statusConnection: (_f = receiver.statusConnection) !== null && _f !== void 0 ? _f : 'offline',
        desktopNotifications,
        hasMentionToAll,
        hasMentionToHere,
        isHighlighted,
        hasMentionToUser,
        hasReplyToThread,
        roomType,
        isThread,
    })) {
        yield (0, desktop_1.notifyDesktopUser)({
            notificationMessage,
            userId: subscription.u._id,
            user: sender,
            message,
            room,
        });
    }
    const queueItems = [];
    if ((0, mobile_1.shouldNotifyMobile)({
        disableAllMessageNotifications,
        mobilePushNotifications,
        hasMentionToAll,
        isHighlighted,
        hasMentionToUser,
        hasReplyToThread,
        roomType,
        isThread,
        isVideoConf,
        userPreferences: (_g = receiver.settings) === null || _g === void 0 ? void 0 : _g.preferences,
        roomUids: room.uids,
    })) {
        queueItems.push({
            type: 'push',
            data: yield (0, mobile_1.getPushData)({
                notificationMessage,
                room,
                message,
                userId: subscription.u._id,
                senderUsername: sender.username,
                senderName: sender.name,
                receiver,
            }),
        });
    }
    if (receiver.emails &&
        (0, email_1.shouldNotifyEmail)({
            disableAllMessageNotifications,
            statusConnection: receiver.statusConnection,
            emailNotifications,
            isHighlighted,
            hasMentionToUser,
            hasMentionToAll,
            hasReplyToThread,
            roomType,
            isThread,
        })) {
        const messageWithUnicode = message.msg ? emojione_1.default.shortnameToUnicode(message.msg) : message.msg;
        const firstAttachment = ((_h = message.attachments) === null || _h === void 0 ? void 0 : _h.length) && message.attachments.shift();
        if (firstAttachment) {
            firstAttachment.description =
                typeof firstAttachment.description === 'string' ? emojione_1.default.shortnameToUnicode(firstAttachment.description) : undefined;
            firstAttachment.text = typeof firstAttachment.text === 'string' ? emojione_1.default.shortnameToUnicode(firstAttachment.text) : undefined;
        }
        const attachments = firstAttachment ? [firstAttachment, ...((_j = message.attachments) !== null && _j !== void 0 ? _j : [])].filter(Boolean) : [];
        try {
            for (var _k = true, _l = __asyncValues(receiver.emails), _m; _m = yield _l.next(), _b = _m.done, !_b; _k = true) {
                _d = _m.value;
                _k = false;
                const email = _d;
                if (email.verified) {
                    queueItems.push({
                        type: 'email',
                        data: yield (0, email_1.getEmailData)({
                            message: Object.assign(Object.assign(Object.assign({}, message), { msg: messageWithUnicode }), (attachments.length > 0 ? { attachments } : {})),
                            receiver,
                            sender,
                            subscription,
                            room,
                            emailAddress: email.address,
                            hasMentionToUser,
                        }),
                    });
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_b && (_c = _l.return)) yield _c.call(_l);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    if (queueItems.length) {
        void NotificationQueue_1.Notification.scheduleItem({
            user: receiver,
            uid: subscription.u._id,
            rid: room._id,
            mid: message._id,
            items: queueItems,
        });
    }
});
exports.sendNotification = sendNotification;
const project = {
    $project: {
        'desktopNotifications': 1,
        'emailNotifications': 1,
        'mobilePushNotifications': 1,
        'muteGroupMentions': 1,
        'name': 1,
        'rid': 1,
        'userHighlights': 1,
        'u._id': 1,
        'receiver.active': 1,
        'receiver.emails': 1,
        'receiver.language': 1,
        'receiver.status': 1,
        'receiver.statusConnection': 1,
        'receiver.username': 1,
        'receiver.settings.preferences.enableMobileRinging': 1,
    },
};
const filter = {
    $match: {
        'receiver.active': true,
    },
};
const lookup = {
    $lookup: {
        from: 'users',
        localField: 'u._id',
        foreignField: '_id',
        as: 'receiver',
    },
};
function sendMessageNotifications(message_1, room_1) {
    return __awaiter(this, arguments, void 0, function* (message, room, usersInThread = []) {
        var _a;
        if (server_1.settings.get('Troubleshoot_Disable_Notifications') === true) {
            return;
        }
        const sender = yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).getMsgSender(message);
        if (!sender) {
            return message;
        }
        const { toAll: hasMentionToAll, toHere: hasMentionToHere, mentionIds } = yield (0, notifyUsersOnMessage_1.getMentions)(message);
        const mentionIdsWithoutGroups = [...mentionIds];
        // getMentions removes `all` and `here` from mentionIds so we need to add them back for compatibility
        if (hasMentionToAll) {
            mentionIds.push('all');
        }
        if (hasMentionToHere) {
            mentionIds.push('here');
        }
        // add users in thread to mentions array because they follow the same rules
        mentionIds.push(...usersInThread);
        let notificationMessage = yield callbacks_1.callbacks.run('beforeSendMessageNotifications', message.msg);
        if (mentionIds.length > 0 && server_1.settings.get('UI_Use_Real_Name')) {
            notificationMessage = (0, notifications_1.replaceMentionedUsernamesWithFullNames)(message.msg, (_a = message.mentions) !== null && _a !== void 0 ? _a : []);
        }
        // Don't fetch all users if room exceeds max members
        const maxMembersForNotification = server_1.settings.get('Notifications_Max_Room_Members');
        const roomMembersCount = yield models_1.Users.countRoomMembers(room._id);
        const disableAllMessageNotifications = roomMembersCount > maxMembersForNotification && maxMembersForNotification !== 0;
        const query = {
            rid: room._id,
            ignored: { $ne: sender._id },
            disableNotifications: { $ne: true },
            $or: [{ 'userHighlights.0': { $exists: 1 } }, ...(usersInThread.length > 0 ? [{ 'u._id': { $in: usersInThread } }] : [])],
        };
        ['desktop', 'mobile', 'email'].forEach((kind) => {
            const notificationField = kind === 'mobile' ? 'mobilePush' : `${kind}Notifications`;
            query.$or.push(Object.assign({ [notificationField]: 'all' }, (disableAllMessageNotifications ? { [`${kind}PrefOrigin`]: { $ne: 'user' } } : {})));
            if (disableAllMessageNotifications) {
                return;
            }
            if (room.t === 'd') {
                query.$or.push({
                    [notificationField]: 'mentions',
                });
            }
            else if (mentionIdsWithoutGroups.length > 0) {
                query.$or.push({
                    [notificationField]: 'mentions',
                    'u._id': { $in: mentionIdsWithoutGroups },
                });
            }
            const serverField = kind === 'email' ? 'emailNotificationMode' : `${kind}Notifications`;
            const serverPreference = server_1.settings.get(`Accounts_Default_User_Preferences_${serverField}`);
            if (serverPreference === 'all' || hasMentionToAll || hasMentionToHere || room.t === 'd') {
                query.$or.push({
                    [notificationField]: { $exists: false },
                });
            }
            else if (serverPreference === 'mentions' && mentionIdsWithoutGroups.length > 0) {
                query.$or.push({
                    [notificationField]: { $exists: false },
                    'u._id': { $in: mentionIdsWithoutGroups },
                });
            }
        });
        // the find below is crucial. All subscription records returned will receive at least one kind of notification.
        // the query is defined by the server's default values and Notifications_Max_Room_Members setting.
        const subscriptions = yield models_1.Subscriptions.col.aggregate([{ $match: query }, lookup, filter, project]).toArray();
        subscriptions.forEach((subscription) => void (0, exports.sendNotification)({
            subscription,
            sender,
            hasMentionToAll,
            hasMentionToHere,
            message,
            notificationMessage,
            room,
            mentionIds,
            disableAllMessageNotifications,
            hasReplyToThread: usersInThread === null || usersInThread === void 0 ? void 0 : usersInThread.includes(subscription.u._id),
        }));
        return {
            sender,
            hasMentionToAll,
            hasMentionToHere,
            notificationMessage,
            mentionIds,
            mentionIdsWithoutGroups,
        };
    });
}
function sendAllNotifications(message, room) {
    return __awaiter(this, void 0, void 0, function* () {
        if (server_1.settings.get('Troubleshoot_Disable_Notifications') === true) {
            return message;
        }
        // threads
        if (message.tmid) {
            return message;
        }
        // skips this callback if the message was edited
        if ((0, core_typings_1.isEditedMessage)(message)) {
            return message;
        }
        if (message.ts && Math.abs((0, moment_1.default)(message.ts).diff(new Date())) > 60000) {
            return message;
        }
        if (!room || room.t == null) {
            return message;
        }
        yield sendMessageNotifications(message, room);
        return message;
    });
}
server_1.settings.watch('Troubleshoot_Disable_Notifications', (value) => {
    if (value) {
        return callbacks_1.callbacks.remove('afterSaveMessage', 'sendNotificationsOnMessage');
    }
    callbacks_1.callbacks.add('afterSaveMessage', (message, { room }) => sendAllNotifications(message, room), callbacks_1.callbacks.priority.LOW, 'sendNotificationsOnMessage');
});
