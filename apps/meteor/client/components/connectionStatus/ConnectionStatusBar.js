"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useReconnectCountdown_1 = require("./useReconnectCountdown");
const connectionStatusBarStyle = (0, css_in_js_1.css) `
	color: ${fuselage_1.Palette.statusColor['status-font-on-warning']};
	background-color: ${fuselage_1.Palette.surface['surface-tint']};
	border-color: ${fuselage_1.Palette.statusColor['status-font-on-warning']};

	position: fixed;
	z-index: 1000000;

	display: flex;
	justify-content: space-between;
	align-items: center;

	.rcx-connection-status-bar--wrapper {
		display: flex;
		align-items: center;
		column-gap: 8px;
	}
	.rcx-connection-status-bar--content {
		display: flex;
		align-items: center;
		column-gap: 8px;
	}
	.rcx-connection-status-bar--info {
		color: ${fuselage_1.Palette.text['font-default']};
	}
`;
function ConnectionStatusBar() {
    const { connected, retryTime, status, reconnect } = (0, ui_contexts_1.useConnectionStatus)();
    const reconnectCountdown = (0, useReconnectCountdown_1.useReconnectCountdown)(retryTime, status);
    const { t } = (0, react_i18next_1.useTranslation)();
    if (connected) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { className: connectionStatusBarStyle, "rcx-connection-status-bar": true, insetBlockStart: 0, pb: 4, pi: 12, width: '100%', borderBlockEndWidth: 2, role: 'alert', fontScale: 'p2', children: [(0, jsx_runtime_1.jsxs)("span", { className: 'rcx-connection-status-bar--wrapper', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'warning' }), (0, jsx_runtime_1.jsxs)("span", { className: 'rcx-connection-status-bar--content', children: [(0, jsx_runtime_1.jsx)("strong", { children: t('meteor_status', { context: status }) }), ['waiting', 'failed', 'offline'].includes(status) && ((0, jsx_runtime_1.jsx)("span", { className: 'rcx-connection-status-bar--info', children: status === 'waiting' ? t('meteor_status_reconnect_in', { count: reconnectCountdown }) : t('meteor_status_try_again_later') }))] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: reconnect, small: true, disabled: ['connected', 'connecting'].includes(status), children: t('Connect') })] }));
}
exports.default = ConnectionStatusBar;
