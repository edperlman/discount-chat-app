"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelCoreSourceRoomIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const iconMap = {
    widget: 'livechat',
    email: 'mail',
    sms: 'sms',
    app: 'headset',
    api: 'headset',
    other: 'headset',
};
const OmnichannelCoreSourceRoomIcon = ({ source, color, size }) => {
    const icon = iconMap[(source === null || source === void 0 ? void 0 : source.type) || 'other'] || 'headset';
    return (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: icon, size: size, color: color });
};
exports.OmnichannelCoreSourceRoomIcon = OmnichannelCoreSourceRoomIcon;
