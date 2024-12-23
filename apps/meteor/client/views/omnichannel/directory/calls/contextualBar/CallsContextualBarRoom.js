"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const VoipInfo_1 = require("./VoipInfo");
const RoomContext_1 = require("../../../../room/contexts/RoomContext");
const RoomToolboxContext_1 = require("../../../../room/contexts/RoomToolboxContext");
// Contextual Bar for room view
const VoipInfoWithData = () => {
    const room = (0, RoomContext_1.useVoipRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    return (0, jsx_runtime_1.jsx)(VoipInfo_1.VoipInfo, { room: room, onClickClose: closeTab });
};
exports.default = VoipInfoWithData;
