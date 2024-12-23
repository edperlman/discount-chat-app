"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelAppSourceRoomIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const OmnichannelRoomIconContext_1 = require("./context/OmnichannelRoomIconContext");
const AsyncStatePhase_1 = require("../../../lib/asyncState/AsyncStatePhase");
const OmnichannelAppSourceRoomIcon = ({ source, color, size, placement }) => {
    const icon = (placement === 'sidebar' && source.sidebarIcon) || source.defaultIcon;
    const { phase, value } = (0, OmnichannelRoomIconContext_1.useOmnichannelRoomIcon)(source.id, icon || '');
    if ([AsyncStatePhase_1.AsyncStatePhase.REJECTED, AsyncStatePhase_1.AsyncStatePhase.LOADING].includes(phase)) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'headset', size: size, color: color });
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { size: size, color: color, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'svg', size: size, "aria-hidden": 'true', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'use', href: `#${value}` }) }) }));
};
exports.OmnichannelAppSourceRoomIcon = OmnichannelAppSourceRoomIcon;
