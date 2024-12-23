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
const AccessibilityShortcut = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const currentRoutePath = router.getLocationPathname();
    const customButtonClass = (0, css_in_js_1.css) `
		position: absolute;
		top: 2px;
		left: 2px;
		z-index: 99;
		&:not(:focus) {
			width: 1px;
			height: 1px;
			padding: 0;
			overflow: hidden;
			clip: rect(1px, 1px, 1px, 1px);
			border: 0;
		}
	`;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { className: customButtonClass, is: 'a', href: `${currentRoutePath}#main-content`, primary: true, children: t('Skip_to_main_content') }));
};
exports.default = AccessibilityShortcut;
