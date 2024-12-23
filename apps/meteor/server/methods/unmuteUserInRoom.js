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
exports.unmuteUserInRoom = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const deprecationWarningLogger_1 = require("../../app/lib/server/lib/deprecationWarningLogger");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const IRoomTypeConfig_1 = require("../../definition/IRoomTypeConfig");
const callbacks_1 = require("../../lib/callbacks");
const roomCoordinator_1 = require("../lib/rooms/roomCoordinator");
const unmuteUserInRoom = (fromId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fromId || !(yield (0, hasPermission_1.hasPermissionAsync)(fromId, 'mute-user', data.rid))) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
            method: 'unmuteUserInRoom',
        });
    }
    const room = yield models_1.Rooms.findOneById(data.rid);
    if (!room) {
        throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
            method: 'unmuteUserInRoom',
        });
    }
    if (!(yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.MUTE, fromId))) {
        throw new meteor_1.Meteor.Error('error-invalid-room-type', `${room.t} is not a valid room type`, {
            method: 'unmuteUserInRoom',
            type: room.t,
        });
    }
    const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUsername(data.rid, data.username, {
        projection: { _id: 1 },
    });
    if (!subscription) {
        throw new meteor_1.Meteor.Error('error-user-not-in-room', 'User is not in this room', {
            method: 'unmuteUserInRoom',
        });
    }
    const unmutedUser = yield models_1.Users.findOneByUsernameIgnoringCase(data.username);
    if (!(unmutedUser === null || unmutedUser === void 0 ? void 0 : unmutedUser.username)) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user to unmute', {
            method: 'unmuteUserInRoom',
        });
    }
    const fromUser = yield models_1.Users.findOneById(fromId);
    if (!fromUser) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'unmuteUserInRoom',
        });
    }
    yield callbacks_1.callbacks.run('beforeUnmuteUser', { unmutedUser, fromUser }, room);
    if (room.ro) {
        yield models_1.Rooms.unmuteReadOnlyUsernameByRoomId(data.rid, unmutedUser.username);
    }
    else {
        yield models_1.Rooms.unmuteMutedUsernameByRoomId(data.rid, unmutedUser.username);
    }
    yield core_services_1.Message.saveSystemMessage('user-unmuted', data.rid, unmutedUser.username, fromUser);
    setImmediate(() => {
        void callbacks_1.callbacks.run('afterUnmuteUser', { unmutedUser, fromUser }, room);
        void (0, notifyListener_1.notifyOnRoomChangedById)(data.rid);
    });
    return true;
});
exports.unmuteUserInRoom = unmuteUserInRoom;
meteor_1.Meteor.methods({
    unmuteUserInRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            deprecationWarningLogger_1.methodDeprecationLogger.method('unmuteUserInRoom', '8.0.0');
            const fromId = meteor_1.Meteor.userId();
            (0, check_1.check)(data, check_1.Match.ObjectIncluding({
                rid: String,
                username: String,
            }));
            if (!fromId) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'unmuteUserInRoom',
                });
            }
            return (0, exports.unmuteUserInRoom)(fromId, data);
        });
    },
});
