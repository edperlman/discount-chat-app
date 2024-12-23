"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoomSettingAllowed = exports.canCreateInviteLinks = exports.isEditableByTheUser = exports.actionAllowed = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const client_1 = require("../../../app/models/client");
const IRoomTypeConfig_1 = require("../../../definition/IRoomTypeConfig");
const allowedUserActionsInFederatedRooms = [
    IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER,
    IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER,
    IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR,
];
const allowedRoomSettingsChangesInFederatedRooms = [IRoomTypeConfig_1.RoomSettingsEnum.NAME, IRoomTypeConfig_1.RoomSettingsEnum.TOPIC];
const actionAllowed = (room, action, displayingUserId, userSubscription) => {
    var _a, _b;
    if (!(0, core_typings_1.isRoomFederated)(room)) {
        return false;
    }
    if ((0, core_typings_1.isDirectMessageRoom)(room)) {
        return false;
    }
    const subscribed = Boolean(userSubscription);
    const defaultUser = !(userSubscription === null || userSubscription === void 0 ? void 0 : userSubscription.roles);
    if (!subscribed || defaultUser) {
        return false;
    }
    const myself = ((_a = userSubscription.u) === null || _a === void 0 ? void 0 : _a._id) === displayingUserId;
    const removingMyself = action === IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER && myself;
    if (removingMyself) {
        return false;
    }
    const displayingUserRoomRoles = ((_b = client_1.RoomRoles.findOne({ 'rid': room._id, 'u._id': displayingUserId })) === null || _b === void 0 ? void 0 : _b.roles) || [];
    const loggedInUserRoomRoles = userSubscription.roles || [];
    if (loggedInUserRoomRoles.includes('owner')) {
        if (action === IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER || action === IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR) {
            return displayingUserRoomRoles.includes('owner') ? myself : true;
        }
        if (action === IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER) {
            return !displayingUserRoomRoles.includes('owner');
        }
        const allowedForOwnersOverDefaultUsers = allowedUserActionsInFederatedRooms.includes(action);
        return allowedForOwnersOverDefaultUsers;
    }
    if (loggedInUserRoomRoles.includes('moderator')) {
        if (displayingUserRoomRoles.includes('owner')) {
            return false;
        }
        if (displayingUserRoomRoles.includes('moderator')) {
            if (action === IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR) {
                return myself;
            }
            return false;
        }
        const allowedForModeratorsOverDefaultUsers = action === IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR || action === IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER;
        return allowedForModeratorsOverDefaultUsers;
    }
    return false;
};
exports.actionAllowed = actionAllowed;
const isEditableByTheUser = (user, room, subscription) => {
    var _a, _b;
    if (!user || !room || !subscription) {
        return false;
    }
    return (0, core_typings_1.isRoomFederated)(room) && Boolean(((_a = subscription.roles) === null || _a === void 0 ? void 0 : _a.includes('owner')) || ((_b = subscription.roles) === null || _b === void 0 ? void 0 : _b.includes('moderator')));
};
exports.isEditableByTheUser = isEditableByTheUser;
const canCreateInviteLinks = (user, room, subscription) => {
    var _a, _b;
    if (!user || !room || !subscription) {
        return false;
    }
    return ((0, core_typings_1.isRoomFederated)(room) &&
        (0, core_typings_1.isPublicRoom)(room) &&
        Boolean(((_a = subscription.roles) === null || _a === void 0 ? void 0 : _a.includes('owner')) || ((_b = subscription.roles) === null || _b === void 0 ? void 0 : _b.includes('moderator'))));
};
exports.canCreateInviteLinks = canCreateInviteLinks;
const isRoomSettingAllowed = (room, setting) => {
    if (!(0, core_typings_1.isRoomFederated)(room)) {
        return false;
    }
    if ((0, core_typings_1.isDirectMessageRoom)(room)) {
        return false;
    }
    return allowedRoomSettingsChangesInFederatedRooms.includes(setting);
};
exports.isRoomSettingAllowed = isRoomSettingAllowed;
