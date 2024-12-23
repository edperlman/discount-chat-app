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
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
meteor_1.Meteor.methods({
    'e2e.getUsersOfRoomWithoutKey'(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'e2e.getUsersOfRoomWithoutKey',
                });
            }
            if (!rid) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'e2e.getUsersOfRoomWithoutKey',
                });
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(rid, userId))) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'e2e.getUsersOfRoomWithoutKey' });
            }
            const subscriptions = yield models_1.Subscriptions.findByRidWithoutE2EKey(rid, {
                projection: { 'u._id': 1 },
            }).toArray();
            const userIds = subscriptions.map((s) => s.u._id);
            const options = { projection: { 'e2e.public_key': 1 } };
            const users = yield models_1.Users.findByIdsWithPublicE2EKey(userIds, options).toArray();
            return {
                users,
            };
        });
    },
});
