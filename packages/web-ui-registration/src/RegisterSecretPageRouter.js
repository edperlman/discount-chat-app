"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSecretPageRouter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const RegisterForm_1 = __importDefault(require("./RegisterForm"));
const RegisterFormDisabled_1 = __importDefault(require("./RegisterFormDisabled"));
const RegisterTemplate_1 = __importDefault(require("./RegisterTemplate"));
const SecretRegisterForm_1 = __importDefault(require("./SecretRegisterForm"));
const SecretRegisterInvalidForm_1 = __importDefault(require("./SecretRegisterInvalidForm"));
const FormSkeleton_1 = __importDefault(require("./template/FormSkeleton"));
const RegisterSecretPageRouter = ({ setLoginRoute, origin, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const registrationMode = (0, ui_contexts_1.useSetting)('Accounts_RegistrationForm', 'Public');
    const isPublicRegistration = registrationMode === 'Public';
    const isRegistrationAllowedForSecret = registrationMode === 'Secret URL';
    const isRegistrationDisabled = registrationMode === 'Disabled' || (origin === 'register' && isRegistrationAllowedForSecret);
    (0, ui_client_1.useDocumentTitle)(t('registration.component.form.createAnAccount'), false);
    if (origin === 'secret-register' && !isRegistrationAllowedForSecret) {
        return (0, jsx_runtime_1.jsx)(SecretRegisterInvalidForm_1.default, {});
    }
    if (isPublicRegistration || (origin === 'invite-register' && isRegistrationAllowedForSecret)) {
        return ((0, jsx_runtime_1.jsx)(RegisterTemplate_1.default, { children: (0, jsx_runtime_1.jsx)(RegisterForm_1.default, { setLoginRoute: setLoginRoute }) }));
    }
    if (isRegistrationDisabled) {
        return ((0, jsx_runtime_1.jsx)(RegisterTemplate_1.default, { children: (0, jsx_runtime_1.jsx)(RegisterFormDisabled_1.default, { setLoginRoute: setLoginRoute }) }));
    }
    if (isRegistrationAllowedForSecret) {
        return (0, jsx_runtime_1.jsx)(SecretRegisterForm_1.default, { setLoginRoute: setLoginRoute });
    }
    return ((0, jsx_runtime_1.jsx)(RegisterTemplate_1.default, { children: (0, jsx_runtime_1.jsx)(FormSkeleton_1.default, {}) }));
};
exports.RegisterSecretPageRouter = RegisterSecretPageRouter;
exports.default = exports.RegisterSecretPageRouter;
