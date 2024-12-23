"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const indicatorStyle = (0, css_in_js_1.css) `
	position: relative;
	display: flex;
	justify-content: center;
	z-index: 3;
`;
const UnreadMessagesIndicator = ({ count, onJumpButtonClick, onMarkAsReadButtonClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: indicatorStyle, mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Bubble, { onClick: onJumpButtonClick, onDismiss: onMarkAsReadButtonClick, icon: 'arrow-up', dismissProps: { 'title': t('Mark_as_read'), 'aria-label': `${t('Mark_as_read')}` }, children: t('unread_messages', { count }) }) }));
};
exports.default = UnreadMessagesIndicator;
