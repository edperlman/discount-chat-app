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
const OutlookSettingItem = ({ id, title, subTitle, enabled, handleEnable }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hovered = (0, css_in_js_1.css) `
		&:hover,
		&:focus {
			background: ${fuselage_1.Palette.surface['surface-hover']};
			.rcx-message {
				background: ${fuselage_1.Palette.surface['surface-hover']};
			}
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { borderBlockEndWidth: 1, borderBlockEndColor: 'stroke-extra-light', borderBlockEndStyle: 'solid', className: hovered, pi: 24, pb: 16, display: 'flex', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mie: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', children: title }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', children: subTitle })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [id === 'authentication' && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, onClick: () => handleEnable(!enabled), children: t('Disable') })), id !== 'authentication' && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: !enabled, small: true, onClick: () => handleEnable(!enabled), children: enabled ? t('Disable') : t('Enable') }))] })] }));
};
exports.default = OutlookSettingItem;
