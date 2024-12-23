"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomDirectives = void 0;
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const getRoomDirectives = ({ room, showingUserId, userSubscription, }) => {
    var _a;
    const roomDirectives = (room === null || room === void 0 ? void 0 : room.t) && roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t);
    const [roomCanSetOwner, roomCanSetLeader, roomCanSetModerator, roomCanIgnore, roomCanBlock, roomCanMute, roomCanRemove, roomCanInvite] = [
        ...((_a = (roomDirectives && [
            roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, showingUserId, userSubscription),
            roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.SET_AS_LEADER, showingUserId, userSubscription),
            roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR, showingUserId, userSubscription),
            roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.IGNORE, showingUserId, userSubscription),
            roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.BLOCK, showingUserId, userSubscription),
            roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.MUTE, showingUserId, userSubscription),
            roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER, showingUserId, userSubscription),
            roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.INVITE, showingUserId, userSubscription),
        ])) !== null && _a !== void 0 ? _a : []),
    ];
    return { roomCanSetOwner, roomCanSetLeader, roomCanSetModerator, roomCanIgnore, roomCanBlock, roomCanMute, roomCanRemove, roomCanInvite };
};
exports.getRoomDirectives = getRoomDirectives;
