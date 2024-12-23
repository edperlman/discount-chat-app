"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const layout_1 = require("@rocket.chat/layout");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useSendForgotPassword_1 = require("./hooks/useSendForgotPassword");
const ResetPasswordForm = ({ setLoginRoute }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const emailId = (0, fuselage_hooks_1.useUniqueId)();
    const formLabelId = (0, fuselage_hooks_1.useUniqueId)();
    const forgotPasswordFormRef = (0, react_1.useRef)(null);
    (0, ui_client_1.useDocumentTitle)(t('registration.component.resetPassword'), false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = (0, react_hook_form_1.useForm)({ mode: 'onBlur' });
    (0, react_1.useEffect)(() => {
        if (forgotPasswordFormRef.current) {
            forgotPasswordFormRef.current.focus();
        }
    }, []);
    const { mutateAsync, isSuccess } = (0, useSendForgotPassword_1.useSendForgotPassword)();
    return ((0, jsx_runtime_1.jsxs)(layout_1.Form, { ref: forgotPasswordFormRef, tabIndex: -1, "aria-labelledby": formLabelId, "aria-describedby": 'welcomeTitle', onSubmit: handleSubmit((data) => {
            mutateAsync({ email: data.email });
        }), children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Header, { children: (0, jsx_runtime_1.jsx)(layout_1.Form.Title, { id: formLabelId, children: t('registration.component.resetPassword') }) }), (0, jsx_runtime_1.jsxs)(layout_1.Form.Container, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: emailId, children: t('registration.component.form.email') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('email', {
                                        required: t('Required_field', { field: t('registration.component.form.email') }),
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: t('registration.page.resetPassword.errors.invalidEmail'),
                                        },
                                    }), { error: (_a = errors.email) === null || _a === void 0 ? void 0 : _a.message, "aria-invalid": Boolean(errors.email), "aria-required": 'true', "aria-describedby": `${emailId}-error`, placeholder: t('registration.component.form.emailPlaceholder'), id: emailId })) }), errors.email && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${emailId}-error`, children: errors.email.message }))] }) }), isSuccess && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { "aria-live": 'assertive', role: 'status', mbs: 24, icon: 'mail', children: t('registration.page.resetPassword.sent') }) }))] }), (0, jsx_runtime_1.jsxs)(layout_1.Form.Footer, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', loading: isSubmitting, primary: true, children: t('registration.page.resetPassword.sendInstructions') }) }), (0, jsx_runtime_1.jsx)(layout_1.ActionLink, { onClick: () => {
                            setLoginRoute('login');
                        }, children: t('registration.page.register.back') })] })] }));
};
exports.ResetPasswordForm = ResetPasswordForm;
exports.default = exports.ResetPasswordForm;
