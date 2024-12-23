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
exports.updateGroupKey = updateGroupKey;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
function updateGroupKey(rid, uid, key, callerUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        // I have a subscription to this room
        const mySub = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, callerUserId);
        if (mySub) {
            // Setting the key to myself, can set directly to the final field
            if (callerUserId === uid) {
                const setGroupE2EKeyResponse = yield models_1.Subscriptions.setGroupE2EKey(mySub._id, key);
                // Case: I create an encrypted room before setting up my keys, and I reset the e2e keys
                // Next login, I'll create the keys for the room, and set them here.
                // However as I reset my keys, I'm on the `usersWaitingForKeys` queue
                // So I need to remove myself from the queue and notify the time i reach here
                // This way, I can provide the keys to other users
                const { modifiedCount } = yield models_1.Rooms.removeUsersFromE2EEQueueByRoomId(mySub.rid, [callerUserId]);
                if (setGroupE2EKeyResponse.modifiedCount) {
                    void (0, notifyListener_1.notifyOnSubscriptionChangedById)(mySub._id);
                }
                if (modifiedCount) {
                    void (0, notifyListener_1.notifyOnRoomChangedById)(mySub.rid);
                }
                return;
            }
            // uid also has subscription to this room
            const { value } = yield models_1.Subscriptions.setGroupE2ESuggestedKey(uid, rid, key);
            if (value) {
                void (0, notifyListener_1.notifyOnSubscriptionChanged)(value);
            }
        }
    });
}
meteor_1.Meteor.methods({
    'e2e.updateGroupKey'(rid, uid, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'e2e.acceptSuggestedGroupKey' });
            }
            deprecationWarningLogger_1.methodDeprecationLogger.method('e2e.updateGroupKey', '8.0.0');
            return updateGroupKey(rid, uid, key, userId);
        });
    },
});
