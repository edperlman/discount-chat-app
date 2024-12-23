"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMembersListRoomAction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const room_1 = require("../../views/room");
const RoomContext_1 = require("../../views/room/contexts/RoomContext");
const useMembersListRoomAction = () => {
    const room = (0, RoomContext_1.useRoom)();
    const broadcast = !!room.broadcast;
    const team = !!room.teamMain;
    const permittedToViewBroadcastMemberList = (0, ui_contexts_1.usePermission)('view-broadcast-member-list', room._id);
    return (0, react_1.useMemo)(() => {
        if (broadcast && !permittedToViewBroadcastMemberList) {
            return undefined;
        }
        return {
            id: 'members-list',
            groups: ['channel', 'group', 'team'],
            title: team ? 'Teams_members' : 'Members',
            icon: 'members',
            tabComponent: room_1.MemberListRouter,
            order: 7,
        };
    }, [broadcast, permittedToViewBroadcastMemberList, team]);
};
exports.useMembersListRoomAction = useMembersListRoomAction;
