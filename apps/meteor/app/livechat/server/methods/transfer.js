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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
const Helper_1 = require("../lib/Helper");
const LivechatTyped_1 = require("../lib/LivechatTyped");
// Deprecated in favor of "livechat/room.forward" endpoint
// TODO: Deprecated: Remove in v6.0.0
meteor_1.Meteor.methods({
    'livechat:transfer'(transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            deprecationWarningLogger_1.methodDeprecationLogger.method('livechat:transfer', '7.0.0');
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-l-room'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:transfer' });
            }
            (0, check_1.check)(transferData, {
                roomId: String,
                userId: check_1.Match.Optional(String),
                departmentId: check_1.Match.Optional(String),
                comment: check_1.Match.Optional(String),
                clientAction: check_1.Match.Optional(Boolean),
            });
            const room = yield models_1.LivechatRooms.findOneById(transferData.roomId);
            if (!room || room.t !== 'l') {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'livechat:transfer' });
            }
            if (!room.open) {
                throw new meteor_1.Meteor.Error('room-closed', 'Room closed', { method: 'livechat:transfer' });
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                throw new meteor_1.Meteor.Error('error-mac-limit-reached', 'MAC limit reached', { method: 'livechat:transfer' });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, uid, {
                projection: { _id: 1 },
            });
            if (!subscription && !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'transfer-livechat-guest'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'livechat:transfer',
                });
            }
            const guest = yield models_1.LivechatVisitors.findOneEnabledById((_a = room.v) === null || _a === void 0 ? void 0 : _a._id);
            if (!guest) {
                throw new meteor_1.Meteor.Error('error-invalid-visitor', 'Invalid visitor', { method: 'livechat:transfer' });
            }
            const user = yield meteor_1.Meteor.userAsync();
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'livechat:transfer' });
            }
            const normalizedTransferData = Object.assign(Object.assign({}, transferData), { transferredBy: (0, Helper_1.normalizeTransferredByData)(user, room) });
            if (normalizedTransferData.userId) {
                const userToTransfer = yield models_1.Users.findOneById(normalizedTransferData.userId);
                if (!userToTransfer) {
                    throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user to transfer the room');
                }
                normalizedTransferData.transferredTo = {
                    _id: userToTransfer._id,
                    username: userToTransfer.username,
                    name: userToTransfer.name,
                };
            }
            return LivechatTyped_1.Livechat.transfer(room, guest, normalizedTransferData);
        });
    },
});
