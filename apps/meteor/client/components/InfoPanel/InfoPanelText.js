"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const wordBreak = (0, css_in_js_1.css) `
	word-break: break-word;
`;
const InfoPanelText = (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ mb: 8, fontScale: 'p2', color: 'hint', className: wordBreak }, props));
exports.default = InfoPanelText;
