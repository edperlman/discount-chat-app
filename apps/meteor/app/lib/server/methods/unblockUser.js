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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const notifyListener_1 = require("../lib/notifyListener");
meteor_1.Meteor.methods({
    unblockUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ rid, blocked }) {
            (0, check_1.check)(rid, String);
            (0, check_1.check)(blocked, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'blockUser' });
            }
            const [blockedUser, blockerUser] = yield Promise.all([
                models_1.Subscriptions.findOneByRoomIdAndUserId(rid, blocked, { projection: { _id: 1 } }),
                models_1.Subscriptions.findOneByRoomIdAndUserId(rid, userId, { projection: { _id: 1 } }),
            ]);
            if (!blockedUser || !blockerUser) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'blockUser' });
            }
            const [blockedResponse, blockerResponse] = yield models_1.Subscriptions.unsetBlockedByRoomId(rid, blocked, userId);
            const listenerUsers = [...((blockedResponse === null || blockedResponse === void 0 ? void 0 : blockedResponse.modifiedCount) ? [blocked] : []), ...((blockerResponse === null || blockerResponse === void 0 ? void 0 : blockerResponse.modifiedCount) ? [userId] : [])];
            if (listenerUsers.length) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserIds)(rid, listenerUsers);
            }
            return true;
        });
    },
});
