"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const EditRoomInfo_1 = __importDefault(require("./EditRoomInfo"));
const RoomContext_1 = require("../../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../../contexts/RoomToolboxContext");
const EditRoomInfoWithData = ({ onClickBack }) => {
    const room = (0, RoomContext_1.useRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    return (0, jsx_runtime_1.jsx)(EditRoomInfo_1.default, { onClickClose: closeTab, onClickBack: onClickBack, room: room });
};
exports.default = EditRoomInfoWithData;
