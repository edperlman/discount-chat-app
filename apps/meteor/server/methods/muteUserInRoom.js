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
exports.muteUserInRoom = void 0;
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
const muteUserInRoom = (fromId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fromId || !(yield (0, hasPermission_1.hasPermissionAsync)(fromId, 'mute-user', data.rid))) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
            method: 'muteUserInRoom',
        });
    }
    const room = yield models_1.Rooms.findOneById(data.rid);
    if (!room) {
        throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
            method: 'muteUserInRoom',
        });
    }
    if (!(yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.MUTE, fromId))) {
        throw new meteor_1.Meteor.Error('error-invalid-room-type', `${room.t} is not a valid room type`, {
            method: 'muteUserInRoom',
            type: room.t,
        });
    }
    const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUsername(data.rid, data.username, {
        projection: { _id: 1 },
    });
    if (!subscription) {
        throw new meteor_1.Meteor.Error('error-user-not-in-room', 'User is not in this room', {
            method: 'muteUserInRoom',
        });
    }
    const mutedUser = yield models_1.Users.findOneByUsernameIgnoringCase(data.username);
    if (!(mutedUser === null || mutedUser === void 0 ? void 0 : mutedUser.username)) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user to mute', {
            method: 'muteUserInRoom',
        });
    }
    const fromUser = yield models_1.Users.findOneById(fromId);
    if (!fromUser) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'muteUserInRoom',
        });
    }
    yield callbacks_1.callbacks.run('beforeMuteUser', { mutedUser, fromUser }, room);
    if (room.ro) {
        yield models_1.Rooms.muteReadOnlyUsernameByRoomId(data.rid, mutedUser.username);
    }
    else {
        yield models_1.Rooms.muteUsernameByRoomId(data.rid, mutedUser.username);
    }
    yield core_services_1.Message.saveSystemMessage('user-muted', data.rid, mutedUser.username, fromUser);
    yield callbacks_1.callbacks.run('afterMuteUser', { mutedUser, fromUser }, room);
    void (0, notifyListener_1.notifyOnRoomChangedById)(data.rid);
    return true;
});
exports.muteUserInRoom = muteUserInRoom;
meteor_1.Meteor.methods({
    muteUserInRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            deprecationWarningLogger_1.methodDeprecationLogger.method('muteUserInRoom', '8.0.0');
            (0, check_1.check)(data, check_1.Match.ObjectIncluding({
                rid: String,
                username: String,
            }));
            const fromId = meteor_1.Meteor.userId();
            if (!fromId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'muteUserInRoom',
                });
            }
            return (0, exports.muteUserInRoom)(fromId, data);
        });
    },
});
