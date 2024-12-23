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
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const LivechatTyped_1 = require("../lib/LivechatTyped");
meteor_1.Meteor.methods({
    'livechat:removeRoom'(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = meteor_1.Meteor.userId();
            if (!user || !(yield (0, hasPermission_1.hasPermissionAsync)(user, 'remove-closed-livechat-room'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:removeRoom' });
            }
            const room = yield models_1.LivechatRooms.findOneById(rid);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'livechat:removeRoom',
                });
            }
            if (room.t !== 'l') {
                throw new meteor_1.Meteor.Error('error-this-is-not-a-livechat-room', 'This is not a Livechat room', {
                    method: 'livechat:removeRoom',
                });
            }
            if (room.open) {
                throw new meteor_1.Meteor.Error('error-room-is-not-closed', 'Room is not closed', {
                    method: 'livechat:removeRoom',
                });
            }
            yield LivechatTyped_1.Livechat.removeRoom(rid);
        });
    },
});
