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
exports.validateRoomMessagePermissionsAsync = validateRoomMessagePermissionsAsync;
exports.canSendMessageAsync = canSendMessageAsync;
const models_1 = require("@rocket.chat/models");
const canAccessRoom_1 = require("./canAccessRoom");
const hasPermission_1 = require("./hasPermission");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const subscriptionOptions = {
    projection: {
        blocked: 1,
        blocker: 1,
    },
};
function validateRoomMessagePermissionsAsync(room_1, _a, extraData_1) {
    return __awaiter(this, arguments, void 0, function* (room, { uid, username, type }, extraData) {
        var _b;
        if (!room) {
            throw new Error('error-invalid-room');
        }
        if (type !== 'app' && !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: uid }, extraData))) {
            throw new Error('error-not-allowed');
        }
        if (yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.BLOCK, uid)) {
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, uid, subscriptionOptions);
            if (subscription && (subscription.blocked || subscription.blocker)) {
                throw new Error('room_is_blocked');
            }
        }
        if (room.ro === true && !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'post-readonly', room._id))) {
            // Unless the user was manually unmuted
            if (username && !(room.unmuted || []).includes(username)) {
                throw new Error("You can't send messages because the room is readonly.");
            }
        }
        if (username && ((_b = room === null || room === void 0 ? void 0 : room.muted) === null || _b === void 0 ? void 0 : _b.includes(username))) {
            throw new Error('You_have_been_muted');
        }
    });
}
function canSendMessageAsync(rid_1, _a, extraData_1) {
    return __awaiter(this, arguments, void 0, function* (rid, { uid, username, type }, extraData) {
        const room = yield models_1.Rooms.findOneById(rid);
        if (!room) {
            throw new Error('error-invalid-room');
        }
        yield validateRoomMessagePermissionsAsync(room, { uid, username, type }, extraData);
        return room;
    });
}
