"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ImageItem = ({ id, url, name, timestamp, username }) => {
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { minWidth: 0, "data-id": id, className: 'gallery-item-container', title: name, display: 'flex', flexGrow: 1, flexShrink: 1, children: [url && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { minWidth: 'x48', children: (0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { size: 'x48', url: url, className: 'gallery-item' }) })), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mis: 8, flexShrink: 1, overflow: 'hidden', className: 'gallery-item', cursor: 'default', children: [name && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, color: 'default', fontScale: 'p2m', className: 'gallery-item', children: name })), username && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withTruncatedText: true, color: 'hint', fontScale: 'p2', className: 'gallery-item', children: ["@", username] })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'hint', fontScale: 'micro', className: 'gallery-item', children: timestamp })] })] }));
};
exports.default = ImageItem;
