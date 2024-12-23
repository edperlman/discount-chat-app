"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConfirmationForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useLoginSendEmailConfirmation_1 = require("./hooks/useLoginSendEmailConfirmation");
const EmailConfirmationForm = ({ email, onBackToLogin }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const basicEmailRegex = /^[^@]+@[^@]+$/;
    const isEmail = basicEmailRegex.test(email || '');
    const { register, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            email: isEmail ? email : '',
        },
    });
    const sendEmail = (0, useLoginSendEmailConfirmation_1.useLoginSendEmailConfirmation)();
    return ((0, jsx_runtime_1.jsxs)(layout_1.Form, { onSubmit: handleSubmit((data) => {
            if (sendEmail.isLoading) {
                return;
            }
            sendEmail.mutate(data.email);
        }), children: [(0, jsx_runtime_1.jsxs)(layout_1.Form.Header, { children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Title, { children: t('registration.component.form.confirmation') }), (0, jsx_runtime_1.jsx)(layout_1.Form.Subtitle, { children: t('registration.page.emailVerification.subTitle') })] }), (0, jsx_runtime_1.jsxs)(layout_1.Form.Container, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { disabled: sendEmail.isLoading || sendEmail.isSuccess, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { htmlFor: 'email', children: [t('registration.component.form.email'), "*"] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('email', {
                                        required: true,
                                    }), { error: errors.email && t('registration.component.form.requiredField'), "aria-invalid": ((_a = errors === null || errors === void 0 ? void 0 : errors.email) === null || _a === void 0 ? void 0 : _a.type) === 'required', placeholder: t('registration.component.form.emailPlaceholder'), id: 'email' })) }), errors.email && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('registration.component.form.requiredField') })] }) }), sendEmail.isSuccess && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'success', children: t('registration.page.emailVerification.sent') }) }))] }), (0, jsx_runtime_1.jsxs)(layout_1.Form.Footer, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: sendEmail.isLoading, type: 'submit', primary: true, children: t('registration.component.form.sendConfirmationEmail') }) }), (0, jsx_runtime_1.jsx)(layout_1.ActionLink, { onClick: () => {
                            onBackToLogin();
                        }, children: t('registration.page.register.back') })] })] }));
};
exports.EmailConfirmationForm = EmailConfirmationForm;
exports.default = exports.EmailConfirmationForm;
