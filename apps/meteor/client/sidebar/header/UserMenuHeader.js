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
const react_i18next_1 = require("react-i18next");
const MarkdownText_1 = __importDefault(require("../../components/MarkdownText"));
const UserStatus_1 = require("../../components/UserStatus");
const useUserDisplayName_1 = require("../../hooks/useUserDisplayName");
const UserMenuHeader = ({ user }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const presenceDisabled = (0, ui_contexts_1.useSetting)('Presence_broadcast_disabled', false);
    const displayName = (0, useUserDisplayName_1.useUserDisplayName)(user);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 'x208', mbe: 'neg-x4', mbs: 'neg-x8', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mie: 4, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x36', username: (user === null || user === void 0 ? void 0 : user.username) || '', etag: user === null || user === void 0 ? void 0 : user.avatarETag }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mis: 4, display: 'flex', overflow: 'hidden', flexDirection: 'column', fontScale: 'p2', mb: 'neg-x4', flexGrow: 1, flexShrink: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, w: 'full', display: 'flex', alignItems: 'center', flexDirection: 'row', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 4, children: [(0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: presenceDisabled ? 'disabled' : user.status }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', withTruncatedText: true, display: 'inline-block', fontWeight: '700', children: displayName })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'hint', children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { withTruncatedText: true, parseEmoji: true, content: (user === null || user === void 0 ? void 0 : user.statusText) || t((_a = user === null || user === void 0 ? void 0 : user.status) !== null && _a !== void 0 ? _a : 'offline'), variant: 'inlineWithoutBreaks' }) })] })] }));
};
exports.default = UserMenuHeader;
