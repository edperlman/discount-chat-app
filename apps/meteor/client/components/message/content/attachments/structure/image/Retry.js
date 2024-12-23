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
const ImageBox_1 = __importDefault(require("./ImageBox"));
const Retry = ({ retry }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const clickable = (0, css_in_js_1.css) `
		cursor: pointer;
		background: ${fuselage_1.Palette.surface['surface-tint']};

		&:hover,
		&:focus {
			background: ${fuselage_1.Palette.surface['surface-hover']};
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(ImageBox_1.default, { className: clickable, onClick: retry, size: 'x160', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'refresh', color: 'hint', size: 'x64' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h3', color: 'default', textAlign: 'center', children: t('Retry') })] }));
};
exports.default = Retry;
