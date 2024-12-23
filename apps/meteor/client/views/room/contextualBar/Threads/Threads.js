"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Thread_1 = __importDefault(require("./Thread"));
const ThreadList_1 = __importDefault(require("./ThreadList"));
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const Threads = () => {
    const { context: tmid } = (0, RoomToolboxContext_1.useRoomToolbox)();
    if (tmid) {
        return (0, jsx_runtime_1.jsx)(Thread_1.default, { tmid: tmid });
    }
    return (0, jsx_runtime_1.jsx)(ThreadList_1.default, {});
};
exports.default = Threads;
