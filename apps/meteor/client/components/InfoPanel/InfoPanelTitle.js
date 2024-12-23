"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const isValidIcon = (icon) => typeof icon === 'string';
const InfoPanelTitle = ({ title, icon }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexShrink: 0, alignItems: 'center', fontScale: 'h4', color: 'default', withTruncatedText: true, children: [isValidIcon(icon) ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: icon, size: 'x22' }) : icon, (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 8, withTruncatedText: true, title: title, children: title })] }));
exports.default = InfoPanelTitle;
