"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importDefault(require("react"));
const useFormatDateAndTime_1 = require("../../../../hooks/useFormatDateAndTime");
const useUserDisplayName_1 = require("../../../../hooks/useUserDisplayName");
const ReadReceiptRow = ({ user, ts }) => {
    const displayName = (0, useUserDisplayName_1.useUserDisplayName)(user || {});
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)({ withSeconds: true });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { role: 'listitem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mbe: 8, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: (user === null || user === void 0 ? void 0 : user.username) || '', size: 'x24' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', mis: 8, children: displayName })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontScale: 'c1', color: 'hint', children: formatDateAndTime(ts) })] }));
};
exports.default = ReadReceiptRow;
