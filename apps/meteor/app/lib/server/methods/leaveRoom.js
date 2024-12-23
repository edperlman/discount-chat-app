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
exports.leaveRoomMethod = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const hasRole_1 = require("../../../authorization/server/functions/hasRole");
const removeUserFromRoom_1 = require("../functions/removeUserFromRoom");
const leaveRoomMethod = (user, rid) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield models_1.Rooms.findOneById(rid);
    if (!room) {
        throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'leaveRoom' });
    }
    if (!user || !(yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.LEAVE, user._id))) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'leaveRoom' });
    }
    if ((room.t === 'c' && !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'leave-c'))) ||
        (room.t === 'p' && !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'leave-p')))) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'leaveRoom' });
    }
    const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, user._id, {
        projection: { _id: 1 },
    });
    if (!subscription) {
        throw new meteor_1.Meteor.Error('error-user-not-in-room', 'You are not in this room', {
            method: 'leaveRoom',
        });
    }
    // If user is room owner, check if there are other owners. If there isn't anyone else, warn user to set a new owner.
    if (yield (0, hasRole_1.hasRoleAsync)(user._id, 'owner', room._id)) {
        const numOwners = yield models_1.Roles.countUsersInRole('owner', room._id);
        if (numOwners === 1) {
            throw new meteor_1.Meteor.Error('error-you-are-last-owner', 'You are the last owner. Please set new owner before leaving the room.', {
                method: 'leaveRoom',
            });
        }
    }
    return (0, removeUserFromRoom_1.removeUserFromRoom)(rid, user);
});
exports.leaveRoomMethod = leaveRoomMethod;
meteor_1.Meteor.methods({
    leaveRoom(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'leaveRoom' });
            }
            const user = (yield meteor_1.Meteor.userAsync());
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'leaveRoom' });
            }
            return (0, exports.leaveRoomMethod)(user, rid);
        });
    },
});
