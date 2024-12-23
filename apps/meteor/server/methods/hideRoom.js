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
exports.hideRoomMethod = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const hideRoomMethod = (userId, rid) => __awaiter(void 0, void 0, void 0, function* () {
    (0, check_1.check)(rid, String);
    if (!userId) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'hideRoom',
        });
    }
    const { modifiedCount } = yield models_1.Subscriptions.hideByRoomIdAndUserId(rid, userId);
    if (modifiedCount) {
        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(rid, userId);
    }
    return modifiedCount;
});
exports.hideRoomMethod = hideRoomMethod;
meteor_1.Meteor.methods({
    hideRoom(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'hideRoom',
                });
            }
            return (0, exports.hideRoomMethod)(uid, rid);
        });
    },
});
