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
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
meteor_1.Meteor.methods({
    'livechat:getFirstRoomMessage'(_a) {
        return __awaiter(this, arguments, void 0, function* ({ rid }) {
            const uid = meteor_1.Meteor.userId();
            deprecationWarningLogger_1.methodDeprecationLogger.method('livechat:getFirsRoomMessage', '7.0.0');
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-l-room'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'livechat:getFirstRoomMessage',
                });
            }
            (0, check_1.check)(rid, String);
            const room = yield models_1.LivechatRooms.findOneById(rid);
            if (!room || room.t !== 'l') {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room');
            }
            return models_1.Messages.findOne({ rid }, { sort: { ts: 1 } });
        });
    },
});
