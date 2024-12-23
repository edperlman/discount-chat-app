"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const ui_theming_1 = require("@rocket.chat/ui-theming");
const react_1 = __importDefault(require("react"));
const SidebarFooterWatermark_1 = require("./SidebarFooterWatermark");
const SidebarFooterDefault = () => {
    const [, , theme] = (0, ui_theming_1.useThemeMode)();
    const logo = (0, ui_contexts_1.useSetting)(theme === 'dark' ? 'Layout_Sidenav_Footer_Dark' : 'Layout_Sidenav_Footer', '').trim();
    const sidebarFooterStyle = (0, css_in_js_1.css) `
		& img {
			max-width: 100%;
			height: 100%;
		}

		& a:any-link {
			color: ${fuselage_1.Palette.text['font-info']};
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.SidebarFooter, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.SidebarDivider, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'footer', pb: 12, pi: 16, height: 'x48', width: 'auto', className: sidebarFooterStyle, dangerouslySetInnerHTML: {
                    __html: logo,
                } }), (0, jsx_runtime_1.jsx)(SidebarFooterWatermark_1.SidebarFooterWatermark, {})] }));
};
exports.default = SidebarFooterDefault;
