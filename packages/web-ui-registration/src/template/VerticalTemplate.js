"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const LoginPoweredBy_1 = __importDefault(require("../components/LoginPoweredBy"));
const LoginSwitchLanguageFooter_1 = __importDefault(require("../components/LoginSwitchLanguageFooter"));
const LoginTerms_1 = __importDefault(require("../components/LoginTerms"));
const RegisterTitle_1 = require("../components/RegisterTitle");
const VerticalTemplate = ({ children }) => {
    const hideLogo = (0, ui_contexts_1.useSetting)('Layout_Login_Hide_Logo', false);
    const customLogo = (0, ui_contexts_1.useAssetWithDarkModePath)('logo');
    const customBackground = (0, ui_contexts_1.useAssetWithDarkModePath)('background');
    return ((0, jsx_runtime_1.jsxs)(layout_1.VerticalWizardLayout, { background: customBackground, logo: !hideLogo && customLogo ? (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', maxHeight: 'x40', mi: 'neg-x8', src: customLogo, alt: 'Logo' }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), children: [(0, jsx_runtime_1.jsx)(layout_1.VerticalWizardLayoutTitle, { children: (0, jsx_runtime_1.jsx)(RegisterTitle_1.RegisterTitle, {}) }), (0, jsx_runtime_1.jsx)(LoginPoweredBy_1.default, {}), children, (0, jsx_runtime_1.jsxs)(layout_1.VerticalWizardLayoutFooter, { children: [(0, jsx_runtime_1.jsx)(LoginTerms_1.default, {}), (0, jsx_runtime_1.jsx)(LoginSwitchLanguageFooter_1.default, {})] })] }));
};
exports.default = VerticalTemplate;
