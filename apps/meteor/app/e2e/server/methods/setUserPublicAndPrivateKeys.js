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
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
meteor_1.Meteor.methods({
    'e2e.setUserPublicAndPrivateKeys'(keyPair) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'e2e.setUserPublicAndPrivateKeys',
                });
            }
            if (!keyPair.force) {
                const keys = yield models_1.Users.fetchKeysByUserId(userId);
                if (keys.private_key && keys.public_key) {
                    throw new meteor_1.Meteor.Error('error-keys-already-set', 'Keys already set', {
                        method: 'e2e.setUserPublicAndPrivateKeys',
                    });
                }
            }
            yield models_1.Users.setE2EPublicAndPrivateKeysByUserId(userId, {
                private_key: keyPair.private_key,
                public_key: keyPair.public_key,
            });
            const subscribedRoomIds = yield models_1.Rooms.getSubscribedRoomIdsWithoutE2EKeys(userId);
            yield models_1.Rooms.addUserIdToE2EEQueueByRoomIds(subscribedRoomIds, userId);
            void (0, notifyListener_1.notifyOnRoomChangedById)(subscribedRoomIds);
        });
    },
});
