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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useAllowPasswordChange_1 = require("./useAllowPasswordChange");
const ChangePassword = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const passwordId = (0, fuselage_hooks_1.useUniqueId)();
    const confirmPasswordId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordVerifierId = (0, fuselage_hooks_1.useUniqueId)();
    const { watch, formState: { errors }, handleSubmit, reset, control, } = (0, react_hook_form_1.useFormContext)();
    const password = watch('password');
    const passwordIsValid = (0, ui_client_1.useValidatePassword)(password);
    const { allowPasswordChange } = (0, useAllowPasswordChange_1.useAllowPasswordChange)();
    // FIXME: replace to endpoint
    const updatePassword = (0, ui_contexts_1.useMethod)('saveUserProfile');
    const handleSave = (_a) => __awaiter(void 0, [_a], void 0, function* ({ password }) {
        try {
            yield updatePassword({ newPassword: password }, {});
            dispatchToastMessage({ type: 'success', message: t('Password_changed_successfully') });
            reset();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({}, props, { is: 'form', autoComplete: 'off', onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: passwordId, children: t('New_password') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'password', rules: {
                                    required: t('Required_field', { field: t('New_password') }),
                                    validate: () => ((password === null || password === void 0 ? void 0 : password.length) && !passwordIsValid ? t('Password_must_meet_the_complexity_requirements') : true),
                                }, render: ({ field }) => {
                                    var _a;
                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, field, { id: passwordId, error: (_a = errors.password) === null || _a === void 0 ? void 0 : _a.message, flexGrow: 1, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'key', size: 'x20' }), disabled: !allowPasswordChange, "aria-describedby": `${passwordVerifierId} ${passwordId}-hint ${passwordId}-error`, "aria-invalid": errors.password ? 'true' : 'false' })));
                                } }) }), !allowPasswordChange && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${passwordId}-hint`, children: t('Password_Change_Disabled') }), (errors === null || errors === void 0 ? void 0 : errors.password) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordId}-error`, children: errors.password.message })), allowPasswordChange && (0, jsx_runtime_1.jsx)(ui_client_1.PasswordVerifier, { password: password, id: passwordVerifierId })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: confirmPasswordId, children: t('Confirm_password') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'confirmationPassword', rules: {
                                    required: t('Required_field', { field: t('Confirm_password') }),
                                    validate: (confirmationPassword) => (password !== confirmationPassword ? t('Passwords_do_not_match') : true),
                                }, render: ({ field }) => {
                                    var _a;
                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, field, { id: confirmPasswordId, error: (_a = errors.confirmationPassword) === null || _a === void 0 ? void 0 : _a.message, flexGrow: 1, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'key', size: 'x20' }), disabled: !allowPasswordChange || !passwordIsValid, "aria-required": password !== '' ? 'true' : 'false', "aria-invalid": errors.confirmationPassword ? 'true' : 'false', "aria-describedby": `${confirmPasswordId}-error` })));
                                } }) }), errors.confirmationPassword && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${confirmPasswordId}-error`, children: errors.confirmationPassword.message }))] })] }) })));
};
exports.default = ChangePassword;
