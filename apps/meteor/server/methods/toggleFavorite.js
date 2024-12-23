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
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
meteor_1.Meteor.methods({
    toggleFavorite(rid, f) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            (0, check_1.check)(f, check_1.Match.Optional(Boolean));
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'toggleFavorite',
                });
            }
            const userSubscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, userId);
            if (!userSubscription) {
                throw new meteor_1.Meteor.Error('error-invalid-subscription', 'You must be part of a room to favorite it', { method: 'toggleFavorite' });
            }
            const { modifiedCount } = yield models_1.Subscriptions.setFavoriteByRoomIdAndUserId(rid, userId, f);
            if (modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(rid, userId);
            }
            return modifiedCount;
        });
    },
});
