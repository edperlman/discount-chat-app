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
exports.handleSuggestedGroupKey = handleSuggestedGroupKey;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
function handleSuggestedGroupKey(handle, rid, userId, method) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!userId) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method });
        }
        const sub = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, userId);
        if (!sub) {
            throw new meteor_1.Meteor.Error('error-subscription-not-found', 'Subscription not found', { method });
        }
        const suggestedKey = String((_a = sub.E2ESuggestedKey) !== null && _a !== void 0 ? _a : '').trim();
        if (!suggestedKey) {
            throw new meteor_1.Meteor.Error('error-no-suggested-key-available', 'No suggested key available', { method });
        }
        if (handle === 'accept') {
            // A merging process can happen here, but we're not doing that for now
            // If a user already has oldRoomKeys, we will ignore the suggested ones
            const oldKeys = sub.oldRoomKeys ? undefined : sub.suggestedOldRoomKeys;
            yield models_1.Subscriptions.setGroupE2EKeyAndOldRoomKeys(sub._id, suggestedKey, oldKeys);
            const { modifiedCount } = yield models_1.Rooms.removeUsersFromE2EEQueueByRoomId(sub.rid, [userId]);
            if (modifiedCount) {
                void (0, notifyListener_1.notifyOnRoomChangedById)(sub.rid);
            }
        }
        if (handle === 'reject') {
            const { modifiedCount } = yield models_1.Rooms.addUserIdToE2EEQueueByRoomIds([sub.rid], userId);
            if (modifiedCount) {
                void (0, notifyListener_1.notifyOnRoomChangedById)(sub.rid);
            }
        }
        const { modifiedCount } = yield models_1.Subscriptions.unsetGroupE2ESuggestedKeyAndOldRoomKeys(sub._id);
        if (modifiedCount) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedById)(sub._id);
        }
    });
}
