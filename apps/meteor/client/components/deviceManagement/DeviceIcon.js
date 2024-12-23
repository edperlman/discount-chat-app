"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const iconMap = {
    'browser': 'desktop',
    'mobile': 'mobile',
    'desktop-app': 'desktop',
    'mobile-app': 'mobile',
};
const DeviceIcon = ({ deviceType }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', p: 4, bg: 'selected', size: 'x24', borderRadius: 'full', mie: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: iconMap[deviceType] || 'globe', size: 'x16', color: 'hint' }) }));
exports.default = DeviceIcon;
