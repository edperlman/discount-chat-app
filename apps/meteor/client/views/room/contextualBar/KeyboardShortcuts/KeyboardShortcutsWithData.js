"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const KeyboardShortcuts_1 = __importDefault(require("./KeyboardShortcuts"));
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const KeyboardShortcutsWithData = () => {
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    return (0, jsx_runtime_1.jsx)(KeyboardShortcuts_1.default, { handleClose: closeTab });
};
exports.default = KeyboardShortcutsWithData;
