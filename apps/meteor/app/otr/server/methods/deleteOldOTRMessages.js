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
meteor_1.Meteor.methods({
    deleteOldOTRMessages(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'deleteOldOTRMessages',
                });
            }
            const now = new Date();
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, userId);
            if ((subscription === null || subscription === void 0 ? void 0 : subscription.t) !== 'd') {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'deleteOldOTRMessages',
                });
            }
            yield models_1.Messages.deleteOldOTRMessages(roomId, now);
            yield models_1.ReadReceipts.removeOTRReceiptsUntilDate(roomId, now);
        });
    },
});
