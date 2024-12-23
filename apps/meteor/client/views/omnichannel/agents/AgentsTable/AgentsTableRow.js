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
const GenericTable_1 = require("../../../../components/GenericTable");
const useRemoveAgent_1 = require("../hooks/useRemoveAgent");
const AgentsTableRow = ({ user: { _id, name, username, avatarETag, emails, statusLivechat }, mediaQuery, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const handleDelete = (0, useRemoveAgent_1.useRemoveAgent)(_id);
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { "data-qa-id": username, action: true, onClick: () => router.navigate(`/omnichannel/agents/info/${_id}`), children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [username && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: mediaQuery ? 'x28' : 'x40', title: username, username: username, etag: avatarETag }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', withTruncatedText: true, mi: 8, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignSelf: 'center', withTruncatedText: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, color: 'default', children: name || username }), !mediaQuery && name && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: `@${username}` }))] }) })] }) }), mediaQuery && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableCell, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, color: 'hint', children: username }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4 })] })), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (emails === null || emails === void 0 ? void 0 : emails.length) && emails[0].address }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: statusLivechat === 'available' ? t('Available') : t('Not_Available') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'trash', small: true, title: t('Remove'), onClick: (e) => {
                        e.stopPropagation();
                        handleDelete();
                    } }) })] }));
};
exports.default = AgentsTableRow;
