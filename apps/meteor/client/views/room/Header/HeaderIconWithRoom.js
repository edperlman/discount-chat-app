"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = __importDefault(require("react"));
const Header_1 = require("../../../components/Header");
const OmnichannelRoomIcon_1 = require("../../../components/RoomIcon/OmnichannelRoomIcon");
const useRoomIcon_1 = require("../../../hooks/useRoomIcon");
const HeaderIconWithRoom = ({ room }) => {
    var _a;
    const icon = (0, useRoomIcon_1.useRoomIcon)(room);
    if ((0, core_typings_1.isOmnichannelRoom)(room)) {
        return (0, jsx_runtime_1.jsx)(OmnichannelRoomIcon_1.OmnichannelRoomIcon, { source: room.source, status: (_a = room.v) === null || _a === void 0 ? void 0 : _a.status, size: 'x20' });
    }
    return (0, jsx_runtime_1.jsx)(Header_1.HeaderIcon, { icon: icon });
};
exports.default = HeaderIconWithRoom;
