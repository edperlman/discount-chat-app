"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const RoomHeader_1 = __importDefault(require("./RoomHeader"));
const usePresence_1 = require("../../../hooks/usePresence");
const DirectRoomHeader = ({ room, slots }) => {
    var _a;
    const userId = (0, ui_contexts_1.useUserId)();
    const directUserId = (_a = room.uids) === null || _a === void 0 ? void 0 : _a.filter((uid) => uid !== userId).shift();
    const directUserData = (0, usePresence_1.usePresence)(directUserId);
    return (0, jsx_runtime_1.jsx)(RoomHeader_1.default, { slots: slots, room: room, topic: directUserData === null || directUserData === void 0 ? void 0 : directUserData.statusText });
};
exports.default = DirectRoomHeader;
