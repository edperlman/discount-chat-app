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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdsFromHighlights = void 0;
exports.getMentions = getMentions;
exports.updateThreadUsersSubscriptions = updateThreadUsersSubscriptions;
exports.notifyUsersOnMessage = notifyUsersOnMessage;
exports.notifyUsersOnSystemMessage = notifyUsersOnSystemMessage;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const notifyListener_1 = require("./notifyListener");
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../settings/server");
const messageContainsHighlight_1 = require("../functions/notifications/messageContainsHighlight");
function getMentions(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const { mentions, u: { _id: senderId }, } = message;
        if (!mentions) {
            return {
                toAll: false,
                toHere: false,
                mentionIds: [],
            };
        }
        const toAll = mentions.some(({ _id }) => _id === 'all');
        const toHere = mentions.some(({ _id }) => _id === 'here');
        const teamsMentions = mentions.filter((mention) => mention.type === 'team');
        const filteredMentions = mentions
            .filter((mention) => !mention.type || mention.type === 'user')
            .filter(({ _id }) => _id !== senderId && !['all', 'here'].includes(_id))
            .map(({ _id }) => _id);
        const mentionIds = yield callbacks_1.callbacks.run('beforeGetMentions', filteredMentions, teamsMentions);
        return {
            toAll,
            toHere,
            mentionIds,
        };
    });
}
const getGroupMentions = (roomType, unreadCount) => {
    const incUnreadByGroup = ['all_messages', 'group_mentions_only', 'user_and_group_mentions_only'].includes(unreadCount);
    return roomType === 'd' || roomType === 'l' || incUnreadByGroup ? 1 : 0;
};
const getUserMentions = (roomType, unreadCount) => {
    const incUnreadByUser = ['all_messages', 'user_mentions_only', 'user_and_group_mentions_only'].includes(unreadCount);
    return roomType === 'd' || roomType === 'l' || incUnreadByUser ? 1 : 0;
};
const getUserIdsFromHighlights = (rid, message) => __awaiter(void 0, void 0, void 0, function* () {
    const highlightOptions = { projection: { 'userHighlights': 1, 'u._id': 1 } };
    const subs = yield models_1.Subscriptions.findByRoomWithUserHighlights(rid, highlightOptions).toArray();
    return subs
        .filter(({ userHighlights, u: { _id: uid } }) => userHighlights && (0, messageContainsHighlight_1.messageContainsHighlight)(message, userHighlights) && uid !== message.u._id)
        .map(({ u: { _id: uid } }) => uid);
});
exports.getUserIdsFromHighlights = getUserIdsFromHighlights;
const getUnreadSettingCount = (roomType) => {
    let unreadSetting = 'Unread_Count';
    switch (roomType) {
        case 'd': {
            unreadSetting = 'Unread_Count_DM';
            break;
        }
        case 'l': {
            unreadSetting = 'Unread_Count_Omni';
            break;
        }
    }
    return server_1.settings.get(unreadSetting);
};
function updateUsersSubscriptions(message, room) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!room || message.tmid) {
            return;
        }
        const [mentions, highlightIds] = yield Promise.all([getMentions(message), (0, exports.getUserIdsFromHighlights)(room._id, message)]);
        const { toAll, toHere, mentionIds } = mentions;
        const userIds = [...new Set([...mentionIds, ...highlightIds])];
        const unreadCount = getUnreadSettingCount(room.t);
        const userMentionInc = getUserMentions(room.t, unreadCount);
        const groupMentionInc = getGroupMentions(room.t, unreadCount);
        void models_1.Subscriptions.findByRoomIdAndNotAlertOrOpenExcludingUserIds({
            roomId: room._id,
            uidsExclude: [message.u._id],
            uidsInclude: userIds,
            onlyRead: !toAll && !toHere && unreadCount !== 'all_messages',
        }).forEach((sub) => {
            const hasUserMention = userIds.includes(sub.u._id);
            const shouldIncUnread = hasUserMention || toAll || toHere || unreadCount === 'all_messages';
            void (0, notifyListener_1.notifyOnSubscriptionChanged)(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, sub), { alert: true, open: true }), (shouldIncUnread && { unread: sub.unread + 1 })), (hasUserMention && { userMentions: sub.userMentions + 1 })), ((toAll || toHere) && { groupMentions: sub.groupMentions + 1 })), 'updated');
        });
        // Give priority to user mentions over group mentions
        if (userIds.length) {
            yield models_1.Subscriptions.incUserMentionsAndUnreadForRoomIdAndUserIds(room._id, userIds, 1, userMentionInc);
        }
        else if (toAll || toHere) {
            yield models_1.Subscriptions.incGroupMentionsAndUnreadForRoomIdExcludingUserId(room._id, message.u._id, 1, groupMentionInc);
        }
        if (!toAll && !toHere && unreadCount === 'all_messages') {
            yield models_1.Subscriptions.incUnreadForRoomIdExcludingUserIds(room._id, [...userIds, message.u._id], 1);
        }
        // update subscriptions of other members of the room
        yield Promise.all([
            models_1.Subscriptions.setAlertForRoomIdExcludingUserId(message.rid, message.u._id),
            models_1.Subscriptions.setOpenForRoomIdExcludingUserId(message.rid, message.u._id),
        ]);
        // update subscription of the message sender
        yield models_1.Subscriptions.setAsReadByRoomIdAndUserId(message.rid, message.u._id);
        const setAsReadResponse = yield models_1.Subscriptions.setAsReadByRoomIdAndUserId(message.rid, message.u._id);
        if (setAsReadResponse.modifiedCount) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(message.rid, message.u._id);
        }
    });
}
function updateThreadUsersSubscriptions(message, replies) {
    return __awaiter(this, void 0, void 0, function* () {
        // Don't increase unread counter on thread messages
        const repliesPlusSender = [...new Set([message.u._id, ...replies])];
        const responses = yield Promise.all([
            models_1.Subscriptions.setAlertForRoomIdAndUserIds(message.rid, replies),
            models_1.Subscriptions.setOpenForRoomIdAndUserIds(message.rid, repliesPlusSender),
            models_1.Subscriptions.setLastReplyForRoomIdAndUserIds(message.rid, repliesPlusSender, new Date()),
        ]);
        responses.some((response) => response === null || response === void 0 ? void 0 : response.modifiedCount) &&
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserIds)(message.rid, repliesPlusSender);
    });
}
function notifyUsersOnMessage(message, room, roomUpdater) {
    return __awaiter(this, void 0, void 0, function* () {
        // Skips this callback if the message was edited and increments it if the edit was way in the past (aka imported)
        if ((0, core_typings_1.isEditedMessage)(message)) {
            if (Math.abs((0, moment_1.default)(message.editedAt).diff(Date.now())) > 60000) {
                // TODO: Review as I am not sure how else to get around this as the incrementing of the msgs count shouldn't be in this callback
                models_1.Rooms.getIncMsgCountUpdateQuery(1, roomUpdater);
                return message;
            }
            // Only updates last message if it was edited (skip rest of callback)
            if (server_1.settings.get('Store_Last_Message') &&
                (!message.tmid || message.tshow) &&
                (!room.lastMessage || room.lastMessage._id === message._id)) {
                models_1.Rooms.getLastMessageUpdateQuery(message, roomUpdater);
            }
            return message;
        }
        if (message.ts && Math.abs((0, moment_1.default)(message.ts).diff(Date.now())) > 60000) {
            models_1.Rooms.getIncMsgCountUpdateQuery(1, roomUpdater);
            return message;
        }
        // If message sent ONLY on a thread, skips the rest as it is done on a callback specific to threads
        if (message.tmid && !message.tshow) {
            models_1.Rooms.getIncMsgCountUpdateQuery(1, roomUpdater);
            return message;
        }
        // Update all the room activity tracker fields
        models_1.Rooms.setIncMsgCountAndSetLastMessageUpdateQuery(1, message, !!server_1.settings.get('Store_Last_Message'), roomUpdater);
        yield updateUsersSubscriptions(message, room);
        return message;
    });
}
function notifyUsersOnSystemMessage(message, room) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomUpdater = models_1.Rooms.getUpdater();
        models_1.Rooms.setIncMsgCountAndSetLastMessageUpdateQuery(1, message, !!server_1.settings.get('Store_Last_Message'), roomUpdater);
        if (roomUpdater.hasChanges()) {
            yield models_1.Rooms.updateFromUpdater({ _id: room._id }, roomUpdater);
        }
        // TODO: Rewrite to use just needed calls from the function
        yield updateUsersSubscriptions(message, room);
        return message;
    });
}
callbacks_1.callbacks.add('afterSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room, roomUpdater }) {
    if (!roomUpdater) {
        return message;
    }
    yield notifyUsersOnMessage(message, room, roomUpdater);
    return message;
}), callbacks_1.callbacks.priority.MEDIUM, 'notifyUsersOnMessage');
