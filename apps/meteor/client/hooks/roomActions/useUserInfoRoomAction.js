"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserInfoRoomAction = void 0;
const react_1 = require("react");
const room_1 = require("../../views/room");
const useUserInfoRoomAction = () => {
    return (0, react_1.useMemo)(() => ({
        id: 'user-info',
        groups: ['direct'],
        title: 'User_Info',
        icon: 'user',
        tabComponent: room_1.MemberListRouter,
        order: 1,
    }), []);
};
exports.useUserInfoRoomAction = useUserInfoRoomAction;
