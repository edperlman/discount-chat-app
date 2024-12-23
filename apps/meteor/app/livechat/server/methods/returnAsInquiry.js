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
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const LivechatTyped_1 = require("../lib/LivechatTyped");
meteor_1.Meteor.methods({
    'livechat:returnAsInquiry'(rid, departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-l-room'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'livechat:returnAsInquiry',
                });
            }
            const room = yield models_1.LivechatRooms.findOneById(rid);
            if (!room || room.t !== 'l') {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'livechat:returnAsInquiry',
                });
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                throw new meteor_1.Meteor.Error('error-mac-limit-reached', 'MAC limit reached', { method: 'livechat:returnAsInquiry' });
            }
            if (!room.open) {
                throw new meteor_1.Meteor.Error('room-closed', 'Room closed', { method: 'livechat:returnAsInquiry' });
            }
            return LivechatTyped_1.Livechat.returnRoomAsInquiry(room, departmentId);
        });
    },
});
