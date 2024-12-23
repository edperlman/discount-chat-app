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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
meteor_1.Meteor.methods({
    'e2e.requestSubscriptionKeys'() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'requestSubscriptionKeys',
                });
            }
            // Get all encrypted rooms that the user is subscribed to and has no E2E key yet
            const subscriptions = yield models_1.Subscriptions.findByUserIdWithoutE2E(userId).toArray();
            const roomIds = subscriptions.map((subscription) => subscription.rid);
            // For all subscriptions without E2E key, get the rooms that have encryption enabled
            const query = {
                e2eKeyId: {
                    $exists: true,
                },
                _id: {
                    $in: roomIds,
                },
            };
            const rooms = models_1.Rooms.find(query);
            yield rooms.forEach((room) => {
                void core_services_1.api.broadcast('notify.e2e.keyRequest', room._id, room.e2eKeyId);
            });
            return true;
        });
    },
});
