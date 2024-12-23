"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const useFormatDateAndTime_1 = require("../../../../../hooks/useFormatDateAndTime");
const AppRequestItem = ({ seen, name, createdDate, message, username }) => {
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const isAdminUser = (0, ui_contexts_1.usePermission)('manage-apps');
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', pb: 12, pie: 24, mbe: 8, flexGrow: '1', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mie: 8, mbs: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', h: 'full', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mie: 16, alignSelf: 'center', height: '100%', width: 'x8', children: !seen && isAdminUser && (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { small: true, variant: 'primary' }) }), username && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x36', username: username })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', mbe: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2b', mie: 4, lineHeight: 'initial', color: 'titles-labels', children: name }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'c1', color: 'annotation', children: formatDateAndTime(createdDate) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', color: 'default', children: message })] })] }));
};
exports.default = AppRequestItem;
