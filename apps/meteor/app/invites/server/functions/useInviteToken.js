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
exports.useInviteToken = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const validateInviteToken_1 = require("./validateInviteToken");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const addUserToRoom_1 = require("../../../lib/server/functions/addUserToRoom");
const useInviteToken = (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'The user is invalid', {
            method: 'useInviteToken',
            field: 'userId',
        });
    }
    if (!token) {
        throw new meteor_1.Meteor.Error('error-invalid-token', 'The invite token is invalid.', {
            method: 'useInviteToken',
            field: 'token',
        });
    }
    const { inviteData, room } = yield (0, validateInviteToken_1.validateInviteToken)(token);
    if (!(yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.INVITE, userId))) {
        throw new meteor_1.Meteor.Error('error-room-type-not-allowed', "Can't join room of this type via invite", {
            method: 'useInviteToken',
            field: 'token',
        });
    }
    const user = yield models_1.Users.findOneById(userId);
    if (!user) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'The user is invalid', {
            method: 'useInviteToken',
            field: 'userId',
        });
    }
    yield models_1.Users.updateInviteToken(user._id, token);
    const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, user._id, {
        projection: { _id: 1 },
    });
    if (!subscription) {
        yield models_1.Invites.increaseUsageById(inviteData._id, 1);
    }
    // If the user already has an username, then join the invite room,
    // If no username is set yet, then the the join will happen on the setUsername method
    if (user.username) {
        yield (0, addUserToRoom_1.addUserToRoom)(room._id, user);
    }
    return {
        room: {
            rid: inviteData.rid,
            prid: room.prid,
            fname: room.fname,
            name: room.name,
            t: room.t,
        },
    };
});
exports.useInviteToken = useInviteToken;
