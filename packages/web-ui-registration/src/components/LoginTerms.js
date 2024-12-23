"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginTerms = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const LoginTerms = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const loginTerms = (0, ui_contexts_1.useSetting)('Layout_Login_Terms', '');
    return ((0, jsx_runtime_1.jsx)(layout_1.HorizontalWizardLayoutCaption, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withRichContent: true, dangerouslySetInnerHTML: { __html: loginTerms !== '' ? loginTerms : t('Layout_Login_Terms_Content') } }) }));
};
exports.LoginTerms = LoginTerms;
exports.default = exports.LoginTerms;
