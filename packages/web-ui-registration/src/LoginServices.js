"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const LoginServicesButton_1 = __importDefault(require("./LoginServicesButton"));
const LoginServices = ({ disabled, setError, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const services = (0, ui_contexts_1.useLoginServices)();
    const showFormLogin = (0, ui_contexts_1.useSetting)('Accounts_ShowFormLogin');
    if (services.length === 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showFormLogin && (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mb: 24, p: 0, children: t('registration.component.form.divider') }), (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { vertical: true, stretch: true, small: true, children: services.map((service) => ((0, jsx_runtime_1.jsx)(LoginServicesButton_1.default, Object.assign({ disabled: disabled }, service, { setError: setError }), service.service))) })] }));
};
exports.default = LoginServices;
