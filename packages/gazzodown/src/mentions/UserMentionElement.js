"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const MarkupInteractionContext_1 = require("../MarkupInteractionContext");
const handleUserMention = (mention, withSymbol) => withSymbol ? `@${mention}` : mention;
const UserMentionElement = ({ mention }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { resolveUserMention, onUserMentionClick, ownUserId, useRealName, showMentionSymbol, triggerProps } = (0, react_1.useContext)(MarkupInteractionContext_1.MarkupInteractionContext);
    const resolved = (0, react_1.useMemo)(() => resolveUserMention === null || resolveUserMention === void 0 ? void 0 : resolveUserMention(mention), [mention, resolveUserMention]);
    const handleClick = (0, react_1.useMemo)(() => (resolved ? onUserMentionClick === null || onUserMentionClick === void 0 ? void 0 : onUserMentionClick(resolved) : undefined), [resolved, onUserMentionClick]);
    if (mention === 'all') {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Message.Highlight, { title: t('Mentions_all_room_members'), variant: 'relevant', children: handleUserMention('all', showMentionSymbol) }));
    }
    if (mention === 'here') {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Message.Highlight, { title: t('Mentions_online_room_members'), variant: 'relevant', children: handleUserMention('here', showMentionSymbol) }));
    }
    if (!resolved) {
        return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["@", mention] });
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Message.Highlight, Object.assign({ variant: resolved._id === ownUserId ? 'critical' : 'other', title: resolved._id === ownUserId ? t('Mentions_you') : t('Mentions_user'), clickable: true, tabIndex: 0, role: 'button', onClick: handleClick, onKeyDown: (e) => {
            (e.code === 'Enter' || e.code === 'Space') && (handleClick === null || handleClick === void 0 ? void 0 : handleClick(e));
        } }, triggerProps, { "data-uid": resolved._id, children: handleUserMention((_a = (useRealName ? resolved.name : resolved.username)) !== null && _a !== void 0 ? _a : mention, showMentionSymbol) })));
};
exports.default = (0, react_1.memo)(UserMentionElement);
