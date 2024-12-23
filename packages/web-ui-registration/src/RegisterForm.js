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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable complexity */
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const layout_1 = require("@rocket.chat/layout");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const EmailConfirmationForm_1 = __importDefault(require("./EmailConfirmationForm"));
const useRegisterMethod_1 = require("./hooks/useRegisterMethod");
const RegisterForm = ({ setLoginRoute }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { t } = (0, react_i18next_1.useTranslation)();
    const requireNameForRegister = (0, ui_contexts_1.useSetting)('Accounts_RequireNameForSignUp', true);
    const requiresPasswordConfirmation = (0, ui_contexts_1.useSetting)('Accounts_RequirePasswordConfirmation', true);
    const manuallyApproveNewUsersRequired = (0, ui_contexts_1.useSetting)('Accounts_ManuallyApproveNewUsers', false);
    const usernameOrEmailPlaceholder = (0, ui_contexts_1.useSetting)('Accounts_EmailOrUsernamePlaceholder', '');
    const passwordPlaceholder = (0, ui_contexts_1.useSetting)('Accounts_PasswordPlaceholder', '');
    const passwordConfirmationPlaceholder = (0, ui_contexts_1.useSetting)('Accounts_ConfirmPasswordPlaceholder', '');
    const formLabelId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordVerifierId = (0, fuselage_hooks_1.useUniqueId)();
    const nameId = (0, fuselage_hooks_1.useUniqueId)();
    const emailId = (0, fuselage_hooks_1.useUniqueId)();
    const usernameId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordConfirmationId = (0, fuselage_hooks_1.useUniqueId)();
    const reasonId = (0, fuselage_hooks_1.useUniqueId)();
    const registerUser = (0, useRegisterMethod_1.useRegisterMethod)();
    const customFields = (0, ui_contexts_1.useAccountsCustomFields)();
    const [serverError, setServerError] = (0, react_1.useState)(undefined);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { register, handleSubmit, setError, watch, getValues, clearErrors, control, formState: { errors }, } = (0, react_hook_form_1.useForm)({ mode: 'onBlur' });
    const { password } = watch();
    const passwordIsValid = (0, ui_client_1.useValidatePassword)(password);
    const registerFormRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (registerFormRef.current) {
            registerFormRef.current.focus();
        }
    }, []);
    const handleRegister = (_a) => __awaiter(void 0, void 0, void 0, function* () {
        var { password, passwordConfirmation: _ } = _a, formData = __rest(_a, ["password", "passwordConfirmation"]);
        registerUser.mutate(Object.assign({ pass: password }, formData), {
            onError: (error) => {
                if ([error.error, error.errorType].includes('error-invalid-email')) {
                    setError('email', { type: 'invalid-email', message: t('registration.component.form.invalidEmail') });
                }
                if (error.errorType === 'error-user-already-exists') {
                    setError('username', { type: 'user-already-exists', message: t('registration.component.form.usernameAlreadyExists') });
                }
                if (/Email already exists/.test(error.error)) {
                    setError('email', { type: 'email-already-exists', message: t('registration.component.form.emailAlreadyExists') });
                }
                if (/Username is already in use/.test(error.error)) {
                    setError('username', { type: 'username-already-exists', message: t('registration.component.form.userAlreadyExist') });
                }
                if (/The username provided is not valid/.test(error.error)) {
                    setError('username', {
                        type: 'username-contains-invalid-chars',
                        message: t('registration.component.form.usernameContainsInvalidChars'),
                    });
                }
                if (/Name contains invalid characters/.test(error.error)) {
                    setError('name', { type: 'name-contains-invalid-chars', message: t('registration.component.form.nameContainsInvalidChars') });
                }
                if (/error-too-many-requests/.test(error.error)) {
                    dispatchToastMessage({ type: 'error', message: error.error });
                }
                if (/error-user-is-not-activated/.test(error.error)) {
                    dispatchToastMessage({ type: 'info', message: t('registration.page.registration.waitActivationWarning') });
                    setLoginRoute('login');
                }
                if (error.error === 'error-user-registration-custom-field') {
                    setServerError(error.message);
                }
            },
        });
    });
    if (((_a = errors.email) === null || _a === void 0 ? void 0 : _a.type) === 'invalid-email') {
        return (0, jsx_runtime_1.jsx)(EmailConfirmationForm_1.default, { onBackToLogin: () => clearErrors('email'), email: getValues('email') });
    }
    return ((0, jsx_runtime_1.jsxs)(layout_1.Form, { tabIndex: -1, ref: registerFormRef, "aria-labelledby": formLabelId, "aria-describedby": 'welcomeTitle', onSubmit: handleSubmit(handleRegister), children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Header, { children: (0, jsx_runtime_1.jsx)(layout_1.Form.Title, { id: formLabelId, children: t('registration.component.form.createAnAccount') }) }), (0, jsx_runtime_1.jsx)(layout_1.Form.Container, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: requireNameForRegister, htmlFor: nameId, children: t('registration.component.form.name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('name', {
                                        required: requireNameForRegister ? t('Required_field', { field: t('registration.component.form.name') }) : false,
                                    }), { error: (_b = errors === null || errors === void 0 ? void 0 : errors.name) === null || _b === void 0 ? void 0 : _b.message, "aria-required": requireNameForRegister, "aria-invalid": errors.name ? 'true' : 'false', placeholder: t('onboarding.form.adminInfoForm.fields.fullName.placeholder'), "aria-describedby": `${nameId}-error`, id: nameId })) }), errors.name && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameId}-error`, children: errors.name.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: emailId, children: t('registration.component.form.email') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('email', {
                                        required: t('Required_field', { field: t('registration.component.form.email') }),
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: t('registration.component.form.invalidEmail'),
                                        },
                                    }), { placeholder: usernameOrEmailPlaceholder || t('registration.component.form.emailPlaceholder'), error: (_c = errors === null || errors === void 0 ? void 0 : errors.email) === null || _c === void 0 ? void 0 : _c.message, "aria-required": 'true', "aria-invalid": errors.email ? 'true' : 'false', "aria-describedby": `${emailId}-error`, id: emailId })) }), errors.email && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${emailId}-error`, children: errors.email.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: usernameId, children: t('registration.component.form.username') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('username', {
                                        required: t('Required_field', { field: t('registration.component.form.username') }),
                                    }), { error: (_d = errors === null || errors === void 0 ? void 0 : errors.username) === null || _d === void 0 ? void 0 : _d.message, "aria-required": 'true', "aria-invalid": errors.username ? 'true' : 'false', "aria-describedby": `${usernameId}-error`, id: usernameId, placeholder: 'jon.doe' })) }), errors.username && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${usernameId}-error`, children: errors.username.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: passwordId, children: t('registration.component.form.password') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, register('password', {
                                        required: t('Required_field', { field: t('registration.component.form.password') }),
                                        validate: () => (!passwordIsValid ? t('Password_must_meet_the_complexity_requirements') : true),
                                    }), { error: (_e = errors.password) === null || _e === void 0 ? void 0 : _e.message, "aria-required": 'true', "aria-invalid": errors.password ? 'true' : undefined, id: passwordId, placeholder: passwordPlaceholder || t('Create_a_password'), "aria-describedby": `${passwordVerifierId} ${passwordId}-error` })) }), (errors === null || errors === void 0 ? void 0 : errors.password) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordId}-error`, children: errors.password.message })), (0, jsx_runtime_1.jsx)(ui_client_1.PasswordVerifier, { password: password, id: passwordVerifierId })] }), requiresPasswordConfirmation && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: passwordConfirmationId, children: t('registration.component.form.confirmPassword') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, register('passwordConfirmation', {
                                        required: t('Required_field', { field: t('registration.component.form.confirmPassword') }),
                                        deps: ['password'],
                                        validate: (val) => (watch('password') === val ? true : t('registration.component.form.invalidConfirmPass')),
                                    }), { error: (_f = errors.passwordConfirmation) === null || _f === void 0 ? void 0 : _f.message, "aria-required": 'true', "aria-invalid": errors.passwordConfirmation ? 'true' : 'false', id: passwordConfirmationId, "aria-describedby": `${passwordConfirmationId}-error`, placeholder: passwordConfirmationPlaceholder || t('Confirm_password'), disabled: !passwordIsValid })) }), errors.passwordConfirmation && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordConfirmationId}-error`, children: errors.passwordConfirmation.message }))] })), manuallyApproveNewUsersRequired && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: reasonId, children: t('registration.component.form.reasonToJoin') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({}, register('reason', {
                                        required: t('Required_field', { field: t('registration.component.form.reasonToJoin') }),
                                    }), { error: (_g = errors === null || errors === void 0 ? void 0 : errors.reason) === null || _g === void 0 ? void 0 : _g.message, "aria-required": 'true', "aria-invalid": errors.reason ? 'true' : 'false', "aria-describedby": `${reasonId}-error`, id: reasonId })) }), errors.reason && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${reasonId}-error`, children: errors.reason.message }))] })), (0, jsx_runtime_1.jsx)(ui_client_1.CustomFieldsForm, { formName: 'customFields', formControl: control, metadata: customFields }), serverError && (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: serverError })] }) }), (0, jsx_runtime_1.jsxs)(layout_1.Form.Footer, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', loading: registerUser.isLoading, primary: true, children: t('registration.component.form.joinYourTeam') }) }), (0, jsx_runtime_1.jsx)(layout_1.ActionLink, { onClick: () => {
                            setLoginRoute('login');
                        }, children: (0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'registration.page.register.back', children: "Back to Login" }) })] })] }));
};
exports.RegisterForm = RegisterForm;
exports.default = exports.RegisterForm;
