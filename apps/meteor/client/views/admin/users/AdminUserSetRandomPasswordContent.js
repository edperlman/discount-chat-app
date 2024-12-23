"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const AdminUserSetRandomPasswordContent = ({ control, setRandomPassword, isNewUserPage, passwordId, errors, password, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const passwordConfirmationId = (0, fuselage_hooks_1.useUniqueId)();
    const requirePasswordChangeId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordVerifierId = (0, fuselage_hooks_1.useUniqueId)();
    const requiresPasswordConfirmation = (0, ui_contexts_1.useSetting)('Accounts_RequirePasswordConfirmation', true);
    const passwordPlaceholder = (0, ui_contexts_1.useSetting)('Accounts_PasswordPlaceholder', '');
    const passwordConfirmationPlaceholder = (0, ui_contexts_1.useSetting)('Accounts_ConfirmPasswordPlaceholder', '');
    const passwordIsValid = (0, ui_client_1.useValidatePassword)(password);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1, mbe: 8, mbs: 12, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: requirePasswordChangeId, children: t('Require_password_change') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'requirePasswordChange', render: ({ field: { ref, onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { ref: ref, id: requirePasswordChangeId, disabled: setRandomPassword, checked: value, onChange: onChange })) }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'password', rules: {
                        validate: () => ((password === null || password === void 0 ? void 0 : password.length) && !passwordIsValid ? t('Password_must_meet_the_complexity_requirements') : true),
                        required: isNewUserPage && t('Required_field', { field: t('Password') }),
                    }, render: ({ field }) => {
                        var _a;
                        return ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, field, { id: passwordId, "aria-invalid": errors.password ? 'true' : 'false', "aria-describedby": `${passwordId}-error`, error: (_a = errors.password) === null || _a === void 0 ? void 0 : _a.message, flexGrow: 1, placeholder: passwordPlaceholder || t('Password') })));
                    } }) }), (errors === null || errors === void 0 ? void 0 : errors.password) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordId}-error`, children: errors.password.message })), requiresPasswordConfirmation && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'passwordConfirmation', rules: {
                        required: isNewUserPage && t('Required_field', { field: t('Confirm_password') }),
                        deps: ['password'],
                        validate: (confirmationPassword) => (password !== confirmationPassword ? t('Invalid_confirm_pass') : true),
                    }, render: ({ field }) => {
                        var _a;
                        return ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, field, { id: passwordConfirmationId, "aria-invalid": errors.passwordConfirmation ? 'true' : 'false', "aria-describedby": `${passwordConfirmationId}-error`, error: (_a = errors.passwordConfirmation) === null || _a === void 0 ? void 0 : _a.message, flexGrow: 1, placeholder: passwordConfirmationPlaceholder || t('Confirm_password') })));
                    } }) })), (errors === null || errors === void 0 ? void 0 : errors.passwordConfirmation) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordConfirmationId}-error`, children: errors.passwordConfirmation.message })), (0, jsx_runtime_1.jsx)(ui_client_1.PasswordVerifier, { password: password, id: passwordVerifierId, vertical: true })] }));
};
exports.default = AdminUserSetRandomPasswordContent;
