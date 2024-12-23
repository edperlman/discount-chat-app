"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ParentRoom_1 = __importDefault(require("./ParentRoom"));
const ParentRoomWithEndpointData_1 = __importDefault(require("./ParentRoomWithEndpointData"));
const ParentRoomWithData = ({ room }) => {
    const { prid } = room;
    if (!prid) {
        throw new Error('Parent room ID is missing');
    }
    const subscription = (0, ui_contexts_1.useUserSubscription)(prid);
    if (subscription) {
        return (0, jsx_runtime_1.jsx)(ParentRoom_1.default, { room: subscription });
    }
    return (0, jsx_runtime_1.jsx)(ParentRoomWithEndpointData_1.default, { rid: prid });
};
exports.default = ParentRoomWithData;
