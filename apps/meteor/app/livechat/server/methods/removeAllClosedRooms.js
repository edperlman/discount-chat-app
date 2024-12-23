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
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const LivechatTyped_1 = require("../lib/LivechatTyped");
meteor_1.Meteor.methods({
    'livechat:removeAllClosedRooms'(departmentIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new logger_1.Logger('livechat:removeAllClosedRooms');
            const user = meteor_1.Meteor.userId();
            if (!user || !(yield (0, hasPermission_1.hasPermissionAsync)(user, 'remove-closed-livechat-rooms'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'livechat:removeAllClosedRoom',
                });
            }
            // These are not debug logs since we want to know when the action is performed
            logger.info(`User ${meteor_1.Meteor.userId()} is removing all closed rooms`);
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
            const promises = [];
            yield models_1.LivechatRooms.findClosedRooms(departmentIds, {}, extraQuery).forEach(({ _id }) => {
                promises.push(LivechatTyped_1.Livechat.removeRoom(_id));
            });
            yield Promise.all(promises);
            logger.info(`User ${meteor_1.Meteor.userId()} removed ${promises.length} closed rooms`);
            return promises.length;
        });
    },
});
