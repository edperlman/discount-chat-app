"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelBadges = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = __importDefault(require("react"));
const RoomActivityIcon_1 = require("../../omnichannel/components/RoomActivityIcon");
const useOmnichannelPriorities_1 = require("../../omnichannel/hooks/useOmnichannelPriorities");
const PriorityIcon_1 = require("../../omnichannel/priorities/PriorityIcon");
const OmnichannelBadges = ({ room }) => {
    const { enabled: isPriorityEnabled } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isPriorityEnabled ? (0, jsx_runtime_1.jsx)(PriorityIcon_1.PriorityIcon, { level: room.priorityWeight }) : null, (0, jsx_runtime_1.jsx)(RoomActivityIcon_1.RoomActivityIcon, { room: room })] }));
};
exports.OmnichannelBadges = OmnichannelBadges;
