"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_i18next_1 = require("react-i18next");
const GuestForm = ({ setLoginRoute }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, ui_client_1.useDocumentTitle)(t('registration.component.login'), false);
    return ((0, jsx_runtime_1.jsxs)(layout_1.Form, { children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Header, { children: (0, jsx_runtime_1.jsx)(layout_1.Form.Title, { children: t('registration.page.guest.chooseHowToJoin') }) }), (0, jsx_runtime_1.jsx)(layout_1.Form.Container, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { large: true, stretch: true, vertical: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => setLoginRoute('login'), children: t('registration.page.guest.loginWithRocketChat') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => setLoginRoute('anonymous'), children: t('registration.page.guest.continueAsGuest') })] }) })] }));
};
exports.default = GuestForm;
