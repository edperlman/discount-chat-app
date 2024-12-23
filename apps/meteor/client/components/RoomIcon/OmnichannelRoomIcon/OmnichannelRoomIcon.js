"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelRoomIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = __importDefault(require("react"));
const OmnichannelAppSourceRoomIcon_1 = require("./OmnichannelAppSourceRoomIcon");
const OmnichannelCoreSourceRoomIcon_1 = require("./OmnichannelCoreSourceRoomIcon");
const colors = {
    busy: 'status-font-on-danger',
    away: 'status-font-on-warning',
    online: 'status-font-on-success',
    offline: 'annotation',
    disabled: 'annotation',
};
const OmnichannelRoomIcon = ({ source, color, status, size = 'x16', placement = 'default' }) => {
    const iconColor = color !== null && color !== void 0 ? color : colors[status || core_typings_1.UserStatus.OFFLINE];
    if ((0, core_typings_1.isOmnichannelSourceFromApp)(source)) {
        return (0, jsx_runtime_1.jsx)(OmnichannelAppSourceRoomIcon_1.OmnichannelAppSourceRoomIcon, { source: source, placement: placement, color: iconColor, size: size });
    }
    return (0, jsx_runtime_1.jsx)(OmnichannelCoreSourceRoomIcon_1.OmnichannelCoreSourceRoomIcon, { source: source, color: iconColor, size: size });
};
exports.OmnichannelRoomIcon = OmnichannelRoomIcon;
