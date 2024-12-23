"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Header_1 = require("../../../components/Header");
const useRoomIcon_1 = require("../../../hooks/useRoomIcon");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const ParentRoom = ({ room }) => {
    const icon = (0, useRoomIcon_1.useRoomIcon)(room);
    const handleRedirect = () => roomCoordinator_1.roomCoordinator.openRouteLink(room.t, Object.assign({ rid: room._id }, room));
    return ((0, jsx_runtime_1.jsxs)(Header_1.HeaderTag, { role: 'button', tabIndex: 0, onKeyDown: (e) => (e.code === 'Space' || e.code === 'Enter') && handleRedirect(), onClick: handleRedirect, children: [(0, jsx_runtime_1.jsx)(Header_1.HeaderTagIcon, { icon: icon }), roomCoordinator_1.roomCoordinator.getRoomName(room.t, room)] }));
};
exports.default = ParentRoom;
