"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const BaseAvatar_1 = __importDefault(require("./BaseAvatar"));
const RoomAvatar = function RoomAvatar({ room, url, size }) {
    const getRoomPathAvatar = (0, ui_contexts_1.useRoomAvatarPath)();
    const urlFromContext = getRoomPathAvatar(room);
    return (0, jsx_runtime_1.jsx)(BaseAvatar_1.default, { url: url || urlFromContext, size: size });
};
exports.default = (0, react_1.memo)(RoomAvatar);
