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
exports.removeUserFromRoomMethod = void 0;
const apps_1 = require("@rocket.chat/apps");
const exceptions_1 = require("@rocket.chat/apps-engine/definition/exceptions");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../app/authorization/server");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const hasRole_1 = require("../../app/authorization/server/functions/hasRole");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const server_2 = require("../../app/settings/server");
const IRoomTypeConfig_1 = require("../../definition/IRoomTypeConfig");
const callbacks_1 = require("../../lib/callbacks");
const afterRemoveFromRoomCallback_1 = require("../../lib/callbacks/afterRemoveFromRoomCallback");
const removeUserFromRoles_1 = require("../lib/roles/removeUserFromRoles");
const roomCoordinator_1 = require("../lib/rooms/roomCoordinator");
const removeUserFromRoomMethod = (fromId, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!(yield (0, hasPermission_1.hasPermissionAsync)(fromId, 'remove-user', data.rid))) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
            method: 'removeUserFromRoom',
        });
    }
    const room = yield models_1.Rooms.findOneById(data.rid);
    if (!room || !(yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, fromId))) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
            method: 'removeUserFromRoom',
        });
    }
    const fromUser = yield models_1.Users.findOneById(fromId);
    if (!fromUser) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'removeUserFromRoom',
        });
    }
    // did this way so a ctrl-f would find the permission being used
    const kickAnyUserPermission = room.t === 'c' ? 'kick-user-from-any-c-room' : 'kick-user-from-any-p-room';
    const canKickAnyUser = yield (0, hasPermission_1.hasPermissionAsync)(fromId, kickAnyUserPermission);
    if (!canKickAnyUser && !(yield (0, server_1.canAccessRoomAsync)(room, fromUser))) {
        throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
    }
    const removedUser = yield models_1.Users.findOneByUsernameIgnoringCase(data.username);
    yield core_services_1.Room.beforeUserRemoved(room);
    if (!canKickAnyUser) {
        const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(data.rid, removedUser._id, {
            projection: { _id: 1 },
        });
        if (!subscription) {
            throw new meteor_1.Meteor.Error('error-user-not-in-room', 'User is not in this room', {
                method: 'removeUserFromRoom',
            });
        }
    }
    if (yield (0, hasRole_1.hasRoleAsync)(removedUser._id, 'owner', room._id)) {
        const numOwners = yield models_1.Roles.countUsersInRole('owner', room._id);
        if (numOwners === 1) {
            throw new meteor_1.Meteor.Error('error-you-are-last-owner', 'You are the last owner. Please set new owner before leaving the room.', {
                method: 'removeUserFromRoom',
            });
        }
    }
    try {
        yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPreRoomUserLeave, room, removedUser, fromUser));
    }
    catch (error) {
        if (error.name === exceptions_1.AppsEngineException.name) {
            throw new meteor_1.Meteor.Error('error-app-prevented', error.message);
        }
        throw error;
    }
    yield callbacks_1.callbacks.run('beforeRemoveFromRoom', { removedUser, userWhoRemoved: fromUser }, room);
    const deletedSubscription = yield models_1.Subscriptions.removeByRoomIdAndUserId(data.rid, removedUser._id);
    if (deletedSubscription) {
        void (0, notifyListener_1.notifyOnSubscriptionChanged)(deletedSubscription, 'removed');
    }
    if (['c', 'p'].includes(room.t) === true) {
        yield (0, removeUserFromRoles_1.removeUserFromRolesAsync)(removedUser._id, ['moderator', 'owner'], data.rid);
    }
    yield core_services_1.Message.saveSystemMessage('ru', data.rid, removedUser.username || '', fromUser);
    if (room.teamId && room.teamMain) {
        // if a user is kicked from the main team room, delete the team membership
        yield core_services_1.Team.removeMember(room.teamId, removedUser._id);
    }
    if (room.encrypted && server_2.settings.get('E2E_Enable')) {
        yield models_1.Rooms.removeUsersFromE2EEQueueByRoomId(room._id, [removedUser._id]);
    }
    setImmediate(() => {
        void afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.run({ removedUser, userWhoRemoved: fromUser }, room);
        void (0, notifyListener_1.notifyOnRoomChanged)(room);
    });
    yield ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.triggerEvent(apps_1.AppEvents.IPostRoomUserLeave, room, removedUser, fromUser));
    return true;
});
exports.removeUserFromRoomMethod = removeUserFromRoomMethod;
meteor_1.Meteor.methods({
    removeUserFromRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(data, check_1.Match.ObjectIncluding({
                rid: String,
                username: String,
            }));
            const fromId = meteor_1.Meteor.userId();
            if (!fromId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'removeUserFromRoom',
                });
            }
            return (0, exports.removeUserFromRoomMethod)(fromId, data);
        });
    },
});
