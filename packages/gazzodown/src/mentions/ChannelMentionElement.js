"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const MarkupInteractionContext_1 = require("../MarkupInteractionContext");
const handleChannelMention = (mention, withSymbol) => (withSymbol ? `#${mention}` : mention);
const ChannelMentionElement = ({ mention }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { resolveChannelMention, onChannelMentionClick, showMentionSymbol } = (0, react_1.useContext)(MarkupInteractionContext_1.MarkupInteractionContext);
    const resolved = (0, react_1.useMemo)(() => resolveChannelMention === null || resolveChannelMention === void 0 ? void 0 : resolveChannelMention(mention), [mention, resolveChannelMention]);
    const handleClick = (0, react_1.useMemo)(() => (resolved ? onChannelMentionClick === null || onChannelMentionClick === void 0 ? void 0 : onChannelMentionClick(resolved) : undefined), [resolved, onChannelMentionClick]);
    if (!resolved) {
        return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["#", mention] });
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Message.Highlight, { title: t('Mentions_channel'), tabIndex: 0, role: 'button', variant: 'link', clickable: true, onClick: handleClick, onKeyDown: (e) => {
            (e.code === 'Enter' || e.code === 'Space') && (handleClick === null || handleClick === void 0 ? void 0 : handleClick(e));
        }, children: handleChannelMention((_a = resolved.fname) !== null && _a !== void 0 ? _a : mention, showMentionSymbol) }));
};
exports.default = (0, react_1.memo)(ChannelMentionElement);
