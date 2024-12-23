"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const layout_1 = require("@rocket.chat/layout");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const EmailConfirmationForm_1 = __importDefault(require("./EmailConfirmationForm"));
const LoginServices_1 = __importDefault(require("./LoginServices"));
const LOGIN_SUBMIT_ERRORS = {
    'error-user-is-not-activated': {
        type: 'warning',
        i18n: 'registration.page.registration.waitActivationWarning',
    },
    'error-app-user-is-not-allowed-to-login': {
        type: 'danger',
        i18n: 'registration.page.login.errors.AppUserNotAllowedToLogin',
    },
    'user-not-found': {
        type: 'danger',
        i18n: 'registration.page.login.errors.wrongCredentials',
    },
    'error-login-blocked-for-ip': {
        type: 'danger',
        i18n: 'registration.page.login.errors.loginBlockedForIp',
    },
    'error-login-blocked-for-user': {
        type: 'danger',
        i18n: 'registration.page.login.errors.loginBlockedForUser',
    },
    'error-license-user-limit-reached': {
        type: 'warning',
        i18n: 'registration.page.login.errors.licenseUserLimitReached',
    },
    'error-invalid-email': {
        type: 'danger',
        i18n: 'registration.page.login.errors.invalidEmail',
    },
};
const LoginForm = ({ setLoginRoute }) => {
    var _a, _b, _c;
    const { register, handleSubmit, setError, clearErrors, getValues, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        mode: 'onBlur',
    });
    const { t } = (0, react_i18next_1.useTranslation)();
    const formLabelId = (0, fuselage_hooks_1.useUniqueId)();
    const [errorOnSubmit, setErrorOnSubmit] = (0, react_1.useState)(undefined);
    const isResetPasswordAllowed = (0, ui_contexts_1.useSetting)('Accounts_PasswordReset', true);
    const login = (0, ui_contexts_1.useLoginWithPassword)();
    const showFormLogin = (0, ui_contexts_1.useSetting)('Accounts_ShowFormLogin', true);
    const usernameOrEmailPlaceholder = (0, ui_contexts_1.useSetting)('Accounts_EmailOrUsernamePlaceholder', '');
    const passwordPlaceholder = (0, ui_contexts_1.useSetting)('Accounts_PasswordPlaceholder', '');
    (0, ui_client_1.useDocumentTitle)(t('registration.component.login'), false);
    const loginMutation = (0, react_query_1.useMutation)({
        mutationFn: (formData) => {
            return login(formData.usernameOrEmail, formData.password);
        },
        onError: (error) => {
            if ([error.error, error.errorType].includes('error-invalid-email')) {
                setError('usernameOrEmail', { type: 'invalid-email', message: t('registration.page.login.errors.invalidEmail') });
            }
            if ('error' in error && error.error !== 403) {
                setErrorOnSubmit([error.error, error.reason]);
                return;
            }
            setErrorOnSubmit(['user-not-found']);
        },
    });
    const usernameId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordId = (0, fuselage_hooks_1.useUniqueId)();
    const loginFormRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (loginFormRef.current) {
            loginFormRef.current.focus();
        }
    }, [errorOnSubmit]);
    const renderErrorOnSubmit = ([error, message]) => {
        if (error in LOGIN_SUBMIT_ERRORS) {
            const { type, i18n } = LOGIN_SUBMIT_ERRORS[error];
            return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { id: `${usernameId}-error`, "aria-live": 'assertive', type: type, children: t(i18n) }));
        }
        if (error === 'totp-canceled') {
            return null;
        }
        if (message) {
            return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { id: `${usernameId}-error`, "aria-live": 'assertive', type: 'danger', children: message }));
        }
        return null;
    };
    if (((_a = errors.usernameOrEmail) === null || _a === void 0 ? void 0 : _a.type) === 'invalid-email') {
        return (0, jsx_runtime_1.jsx)(EmailConfirmationForm_1.default, { onBackToLogin: () => clearErrors('usernameOrEmail'), email: getValues('usernameOrEmail') });
    }
    return ((0, jsx_runtime_1.jsxs)(layout_1.Form, { tabIndex: -1, ref: loginFormRef, "aria-labelledby": formLabelId, "aria-describedby": 'welcomeTitle', onSubmit: handleSubmit((data) => __awaiter(void 0, void 0, void 0, function* () { return loginMutation.mutate(data); })), children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Header, { children: (0, jsx_runtime_1.jsx)(layout_1.Form.Title, { id: formLabelId, children: t('registration.component.login') }) }), showFormLogin && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(layout_1.Form.Container, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { disabled: loginMutation.isLoading, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: usernameId, children: t('registration.component.form.emailOrUsername') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('usernameOrEmail', {
                                                    required: t('Required_field', { field: t('registration.component.form.emailOrUsername') }),
                                                }), { placeholder: usernameOrEmailPlaceholder || t('registration.component.form.emailPlaceholder'), error: (_b = errors.usernameOrEmail) === null || _b === void 0 ? void 0 : _b.message, "aria-invalid": errors.usernameOrEmail || errorOnSubmit ? 'true' : 'false', "aria-describedby": `${usernameId}-error`, id: usernameId })) }), errors.usernameOrEmail && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${usernameId}-error`, children: errors.usernameOrEmail.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: passwordId, children: t('registration.component.form.password') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, register('password', {
                                                    required: t('Required_field', { field: t('registration.component.form.password') }),
                                                }), { placeholder: passwordPlaceholder, error: (_c = errors.password) === null || _c === void 0 ? void 0 : _c.message, "aria-invalid": errors.password || errorOnSubmit ? 'true' : 'false', "aria-describedby": `${passwordId}-error`, id: passwordId })) }), errors.password && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordId}-error`, children: errors.password.message })), isResetPasswordAllowed && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { justifyContent: 'end', children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldLink, { href: '#', onClick: (e) => {
                                                        e.preventDefault();
                                                        setLoginRoute('reset-password');
                                                    }, children: (0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'registration.page.login.forgot', children: "Forgot your password?" }) }) }))] })] }), errorOnSubmit && (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { disabled: loginMutation.isLoading, children: renderErrorOnSubmit(errorOnSubmit) })] }), (0, jsx_runtime_1.jsxs)(layout_1.Form.Footer, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: loginMutation.isLoading, type: 'submit', primary: true, children: t('registration.component.login') }) }), (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'registration.page.login.register', children: ["New here? ", (0, jsx_runtime_1.jsx)(layout_1.ActionLink, { onClick: () => setLoginRoute('register'), children: "Create an account" })] }) })] })] })), (0, jsx_runtime_1.jsx)(LoginServices_1.default, { disabled: loginMutation.isLoading, setError: setErrorOnSubmit })] }));
};
exports.LoginForm = LoginForm;
exports.default = exports.LoginForm;
