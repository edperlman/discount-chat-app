"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserInfoGroupRoomAction = void 0;
const react_1 = require("react");
const room_1 = require("../../views/room");
const useUserInfoGroupRoomAction = () => {
    return (0, react_1.useMemo)(() => ({
        id: 'user-info-group',
        groups: ['direct_multiple'],
        title: 'Members',
        icon: 'members',
        tabComponent: room_1.MemberListRouter,
        order: 1,
    }), []);
};
exports.useUserInfoGroupRoomAction = useUserInfoGroupRoomAction;
