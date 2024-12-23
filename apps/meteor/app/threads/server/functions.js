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
exports.readThread = void 0;
exports.reply = reply;
exports.follow = follow;
exports.unfollow = unfollow;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const notifyUsersOnMessage_1 = require("../../lib/server/lib/notifyUsersOnMessage");
function reply(_a, message_1, parentMessage_1, followers_1) {
    return __awaiter(this, arguments, void 0, function* ({ tmid }, message, parentMessage, followers) {
        if (!tmid || (0, core_typings_1.isEditedMessage)(message)) {
            return false;
        }
        const { rid, ts, u } = message;
        const { toAll, toHere, mentionIds } = yield (0, notifyUsersOnMessage_1.getMentions)(message);
        const addToReplies = [
            ...new Set([
                ...followers,
                ...mentionIds,
                ...(Array.isArray(parentMessage.replies) && parentMessage.replies.length ? [u._id] : [parentMessage.u._id, u._id]),
            ]),
        ];
        yield models_1.Messages.updateRepliesByThreadId(tmid, addToReplies, ts);
        const [highlightsUids, threadFollowers] = yield Promise.all([
            (0, notifyUsersOnMessage_1.getUserIdsFromHighlights)(rid, message),
            models_1.Messages.getThreadFollowsByThreadId(tmid),
        ]);
        const threadFollowersUids = (threadFollowers === null || threadFollowers === void 0 ? void 0 : threadFollowers.filter((userId) => userId !== u._id && !mentionIds.includes(userId))) || [];
        // Notify everyone involved in the thread
        const notifyOptions = toAll || toHere ? { groupMention: true } : {};
        // Notify message mentioned users and highlights
        const mentionedUsers = [...new Set([...mentionIds, ...highlightsUids])];
        const promises = [
            models_1.ReadReceipts.setAsThreadById(tmid),
            models_1.Subscriptions.addUnreadThreadByRoomIdAndUserIds(rid, threadFollowersUids, tmid, notifyOptions),
        ];
        if (mentionedUsers.length) {
            promises.push(models_1.Subscriptions.addUnreadThreadByRoomIdAndUserIds(rid, mentionedUsers, tmid, { userMention: true }));
        }
        if (highlightsUids.length) {
            promises.push(models_1.Subscriptions.setAlertForRoomIdAndUserIds(rid, highlightsUids), models_1.Subscriptions.setOpenForRoomIdAndUserIds(rid, highlightsUids));
        }
        yield Promise.allSettled(promises);
        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserIds)(rid, [...threadFollowersUids, ...mentionedUsers, ...highlightsUids]);
    });
}
function follow(_a) {
    return __awaiter(this, arguments, void 0, function* ({ tmid, uid }) {
        if (!tmid || !uid) {
            return false;
        }
        yield models_1.Messages.addThreadFollowerByThreadId(tmid, uid);
    });
}
function unfollow(_a) {
    return __awaiter(this, arguments, void 0, function* ({ tmid, rid, uid }) {
        if (!tmid || !uid) {
            return false;
        }
        const removeUnreadThreadResponse = yield models_1.Subscriptions.removeUnreadThreadByRoomIdAndUserId(rid, uid, tmid);
        if (removeUnreadThreadResponse.modifiedCount) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(rid, uid);
        }
        yield models_1.Messages.removeThreadFollowerByThreadId(tmid, uid);
    });
}
const readThread = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, rid, tmid }) {
    var _b;
    const sub = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, userId, { projection: { tunread: 1 } });
    if (!sub) {
        return;
    }
    // if the thread being marked as read is the last one unread also clear the unread subscription flag
    const clearAlert = sub.tunread && ((_b = sub.tunread) === null || _b === void 0 ? void 0 : _b.length) <= 1 && sub.tunread.includes(tmid);
    const removeUnreadThreadResponse = yield models_1.Subscriptions.removeUnreadThreadByRoomIdAndUserId(rid, userId, tmid, clearAlert);
    if (removeUnreadThreadResponse.modifiedCount) {
        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(rid, userId);
    }
    yield models_1.NotificationQueue.clearQueueByUserId(userId);
});
exports.readThread = readThread;
