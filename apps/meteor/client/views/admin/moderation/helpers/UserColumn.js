"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importDefault(require("react"));
const UserColumn = ({ name, username, fontSize, size }) => {
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [username && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: size, username: username }) })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', mi: 8, withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignSelf: 'center', withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2m', color: 'default', withTruncatedText: true, children: [name && username ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [name, ' ', (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'inline-flex', fontWeight: 300, fontSize: fontSize, children: ["(@", username, ")"] })] })) : (name || username), ' '] }) }) })] }));
};
exports.default = UserColumn;
