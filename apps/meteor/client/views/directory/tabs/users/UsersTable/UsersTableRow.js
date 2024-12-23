"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importDefault(require("react"));
const GenericTable_1 = require("../../../../../components/GenericTable");
const MarkdownText_1 = __importDefault(require("../../../../../components/MarkdownText"));
const useFormatDate_1 = require("../../../../../hooks/useFormatDate");
const UsersTableRow = ({ user: { createdAt, emails, domain, _id, username, name, bio, avatarETag, nickname }, onClick, mediaQuery, federation, canViewFullOtherUserInfo, }) => {
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onKeyDown: onClick(username), onClick: onClick(username), tabIndex: 0, role: 'link', action: true, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { children: username && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x40', title: username, username: username, etag: avatarETag }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withTruncatedText: true, mi: 8, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, children: [name || username, nickname && ` (${nickname})`] }), ' ', (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4 }), ' ', (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: username })] }), (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', fontScale: 'p2', color: 'hint', content: bio })] })] }) }) }), mediaQuery && canViewFullOtherUserInfo && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (emails === null || emails === void 0 ? void 0 : emails.length) && emails[0].address })), federation && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: domain }), mediaQuery && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: formatDate(createdAt) }))] }, _id));
};
exports.default = UsersTableRow;
