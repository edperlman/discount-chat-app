"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const KeyboardShortcutSection = ({ title, command }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Margins, { block: 16, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'section', color: 'default', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', fontWeight: '700', children: title }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', children: command })] }) }));
exports.default = KeyboardShortcutSection;
