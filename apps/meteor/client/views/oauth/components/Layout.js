"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const Layout = ({ children }) => {
    const hideLogo = (0, ui_contexts_1.useSetting)('Layout_Login_Hide_Logo', false);
    const customLogo = (0, ui_contexts_1.useAssetWithDarkModePath)('logo');
    const customBackground = (0, ui_contexts_1.useAssetWithDarkModePath)('background');
    return ((0, jsx_runtime_1.jsx)(layout_1.VerticalWizardLayout, { background: customBackground, logo: !hideLogo && customLogo ? (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', maxHeight: 40, mi: -8, src: customLogo, alt: 'Logo' }) : undefined, children: children }));
};
exports.default = Layout;
