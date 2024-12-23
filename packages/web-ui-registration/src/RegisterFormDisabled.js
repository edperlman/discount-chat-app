"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFormDisabled = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const RegisterFormDisabled = ({ setLoginRoute }) => {
    const linkReplacementText = (0, ui_contexts_1.useSetting)('Accounts_RegistrationForm_LinkReplacementText', '');
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(layout_1.Form, { children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Header, { children: (0, jsx_runtime_1.jsx)(layout_1.Form.Title, { children: t('registration.component.form.register') }) }), (0, jsx_runtime_1.jsx)(layout_1.Form.Container, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { role: 'status', type: 'warning', children: linkReplacementText }) }), (0, jsx_runtime_1.jsx)(layout_1.Form.Footer, { children: (0, jsx_runtime_1.jsx)(layout_1.ActionLink, { onClick: () => {
                        setLoginRoute('login');
                    }, children: (0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'registration.page.register.back', children: "Back to Login" }) }) })] }));
};
exports.RegisterFormDisabled = RegisterFormDisabled;
exports.default = exports.RegisterFormDisabled;
