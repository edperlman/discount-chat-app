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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const layout_1 = require("@rocket.chat/layout");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const HorizontalTemplate_1 = __importDefault(require("../template/HorizontalTemplate"));
const getChangePasswordReason = ({ requirePasswordChange, requirePasswordChangeReason = requirePasswordChange ? 'You_need_to_change_your_password' : 'Please_enter_your_new_password_below', } = {}) => requirePasswordChangeReason;
const ResetPasswordPage = () => {
    var _a, _b, _c;
    const user = (0, ui_contexts_1.useUser)();
    const t = (0, ui_contexts_1.useTranslation)();
    const setUserPassword = (0, ui_contexts_1.useMethod)('setUserPassword');
    const resetPassword = (0, ui_contexts_1.useMethod)('resetPassword');
    const token = (0, ui_contexts_1.useRouteParameter)('token');
    const resetPasswordFormRef = (0, react_1.useRef)(null);
    const passwordId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordConfirmationId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordVerifierId = (0, fuselage_hooks_1.useUniqueId)();
    const formLabelId = (0, fuselage_hooks_1.useUniqueId)();
    const requiresPasswordConfirmation = (0, ui_contexts_1.useSetting)('Accounts_RequirePasswordConfirmation', true);
    const passwordPlaceholder = (0, ui_contexts_1.useSetting)('Accounts_PasswordPlaceholder', '');
    const passwordConfirmationPlaceholder = (0, ui_contexts_1.useSetting)('Accounts_ConfirmPasswordPlaceholder', '');
    const router = (0, ui_contexts_1.useRouter)();
    const changePasswordReason = getChangePasswordReason(user || {});
    const loginWithToken = (0, ui_contexts_1.useLoginWithToken)();
    const { register, handleSubmit, setError, formState: { errors, isSubmitting }, watch, } = (0, react_hook_form_1.useForm)({
        mode: 'onBlur',
    });
    const password = watch('password');
    const passwordIsValid = (0, ui_client_1.useValidatePassword)(password);
    (0, react_1.useEffect)(() => {
        if (resetPasswordFormRef.current) {
            resetPasswordFormRef.current.focus();
        }
    }, []);
    const handleResetPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ password }) {
        try {
            if (token) {
                const result = yield resetPassword(token, password);
                yield loginWithToken(result.token);
                router.navigate('/home');
            }
            else {
                yield setUserPassword(password);
            }
        }
        catch ({ error, reason }) {
            const _error = reason !== null && reason !== void 0 ? reason : error;
            setError('password', { message: String(_error) });
        }
    });
    return ((0, jsx_runtime_1.jsx)(HorizontalTemplate_1.default, { children: (0, jsx_runtime_1.jsxs)(layout_1.Form, { tabIndex: -1, ref: resetPasswordFormRef, "aria-labelledby": formLabelId, "aria-describedby": 'welcomeTitle', onSubmit: handleSubmit(handleResetPassword), children: [(0, jsx_runtime_1.jsxs)(layout_1.Form.Header, { children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Title, { id: formLabelId, children: t('Reset_password') }), (0, jsx_runtime_1.jsx)(layout_1.Form.Subtitle, { children: t(changePasswordReason) })] }), (0, jsx_runtime_1.jsx)(layout_1.Form.Container, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: passwordId, children: t('registration.component.form.password') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, register('password', {
                                            required: t('registration.component.form.requiredField'),
                                            validate: () => (!passwordIsValid ? t('Password_must_meet_the_complexity_requirements') : true),
                                        }), { error: (_a = errors === null || errors === void 0 ? void 0 : errors.password) === null || _a === void 0 ? void 0 : _a.message, "aria-invalid": errors.password ? 'true' : 'false', "aria-required": 'true', id: passwordId, placeholder: passwordPlaceholder || t('Create_a_password'), "aria-describedby": `${passwordVerifierId} ${passwordId}-error` })) }), (errors === null || errors === void 0 ? void 0 : errors.password) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordId}-error`, children: errors.password.message })), (0, jsx_runtime_1.jsx)(ui_client_1.PasswordVerifier, { password: password, id: passwordVerifierId })] }), requiresPasswordConfirmation && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: passwordConfirmationId, children: t('registration.component.form.confirmPassword') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, register('passwordConfirmation', {
                                            required: t('registration.component.form.requiredField'),
                                            deps: ['password'],
                                            validate: (val) => (password === val ? true : t('registration.component.form.invalidConfirmPass')),
                                        }), { error: (_b = errors === null || errors === void 0 ? void 0 : errors.passwordConfirmation) === null || _b === void 0 ? void 0 : _b.message, "aria-required": 'true', "aria-invalid": errors.passwordConfirmation ? 'true' : 'false', "aria-describedby": `${passwordConfirmationId}-error`, id: passwordConfirmationId, placeholder: passwordConfirmationPlaceholder || t('Confirm_password'), disabled: !passwordIsValid })) }), errors.passwordConfirmation && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordConfirmationId}-error`, children: (_c = errors.passwordConfirmation) === null || _c === void 0 ? void 0 : _c.message }))] }))] }) }), (0, jsx_runtime_1.jsx)(layout_1.Form.Footer, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, loading: isSubmitting, type: 'submit', children: t('Reset') }) }) })] }) }));
};
exports.default = ResetPasswordPage;
