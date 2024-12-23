"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const LoginPoweredBy_1 = require("./components/LoginPoweredBy");
const CMSPage = ({ page }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const pageContent = (0, ui_contexts_1.useSetting)(page, '');
    const customLogo = (0, ui_contexts_1.useAssetWithDarkModePath)('logo');
    const customBackground = (0, ui_contexts_1.useAssetWithDarkModePath)('background');
    return ((0, jsx_runtime_1.jsxs)(layout_1.VerticalWizardLayout, { background: customBackground, logo: customLogo ? (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', maxHeight: 'x40', mi: 'neg-x8', src: customLogo, alt: 'Logo' }) : undefined, children: [(0, jsx_runtime_1.jsx)(layout_1.VerticalWizardLayoutTitle, { children: t(page) }), (0, jsx_runtime_1.jsx)(layout_1.VerticalWizardLayoutForm, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { p: 32, children: [(0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { title: t('Back'), icon: 'arrow-back', onClick: () => window.history.back(), style: { float: 'right' } }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withRichContent: true, dangerouslySetInnerHTML: { __html: pageContent } })] }) }), (0, jsx_runtime_1.jsx)(layout_1.VerticalWizardLayoutFooter, { children: (0, jsx_runtime_1.jsx)(LoginPoweredBy_1.LoginPoweredBy, {}) })] }));
};
exports.default = CMSPage;
