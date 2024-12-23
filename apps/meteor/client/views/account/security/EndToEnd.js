"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const accounts_base_1 = require("meteor/accounts-base");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const rocketchat_e2e_1 = require("../../../../app/e2e/client/rocketchat.e2e");
const EndToEnd = (props) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const logout = (0, ui_contexts_1.useLogout)();
    const publicKey = accounts_base_1.Accounts.storageLocation.getItem('public_key');
    const privateKey = accounts_base_1.Accounts.storageLocation.getItem('private_key');
    const resetE2eKey = (0, ui_contexts_1.useMethod)('e2e.resetOwnE2EKey');
    const { handleSubmit, watch, resetField, formState: { errors, isValid }, control, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            password: '',
            passwordConfirm: '',
        },
        mode: 'all',
    });
    const { password } = watch();
    const keysExist = Boolean(publicKey && privateKey);
    const hasTypedPassword = Boolean(password === null || password === void 0 ? void 0 : password.trim().length);
    const saveNewPassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield rocketchat_e2e_1.e2e.changePassword(data.password);
            resetField('password');
            dispatchToastMessage({ type: 'success', message: t('Encryption_key_saved_successfully') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const handleResetE2eKey = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield resetE2eKey();
            if (result) {
                dispatchToastMessage({ type: 'success', message: t('User_e2e_key_was_reset') });
                logout();
            }
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [dispatchToastMessage, resetE2eKey, logout, t]);
    (0, react_1.useEffect)(() => {
        if ((password === null || password === void 0 ? void 0 : password.trim()) === '') {
            resetField('passwordConfirm');
        }
    }, [password, resetField]);
    const passwordId = (0, fuselage_hooks_1.useUniqueId)();
    const e2ePasswordExplanationId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordConfirmId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'p1', id: e2ePasswordExplanationId, dangerouslySetInnerHTML: { __html: t('E2E_Encryption_Password_Explanation') } }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbs: 36, w: 'full', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h4', fontScale: 'h4', mbe: 12, children: t('E2E_Encryption_Password_Change') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { w: 'full', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: passwordId, children: t('New_encryption_password') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'password', rules: { required: t('Required_field', { field: t('New_encryption_password') }) }, render: ({ field }) => {
                                                var _a;
                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, field, { id: passwordId, error: (_a = errors.password) === null || _a === void 0 ? void 0 : _a.message, placeholder: t('New_Password_Placeholder'), disabled: !keysExist, "aria-describedby": `${e2ePasswordExplanationId} ${passwordId}-hint ${passwordId}-error`, "aria-invalid": errors.password ? 'true' : 'false' })));
                                            } }) }), !keysExist && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${passwordId}-hint`, children: t('EncryptionKey_Change_Disabled') }), (errors === null || errors === void 0 ? void 0 : errors.password) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordId}-error`, children: errors.password.message }))] }), hasTypedPassword && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: passwordConfirmId, children: t('Confirm_new_encryption_password') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'passwordConfirm', rules: {
                                                required: t('Required_field', { field: t('Confirm_new_encryption_password') }),
                                                validate: (value) => (password !== value ? 'Your passwords do no match' : true),
                                            }, render: ({ field }) => {
                                                var _a;
                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, field, { id: passwordConfirmId, error: (_a = errors.passwordConfirm) === null || _a === void 0 ? void 0 : _a.message, placeholder: t('Confirm_New_Password_Placeholder'), "aria-describedby": `${passwordConfirmId}-error`, "aria-invalid": errors.password ? 'true' : 'false' })));
                                            } }) }), errors.passwordConfirm && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${passwordConfirmId}-error`, children: errors.passwordConfirm.message }))] }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !(keysExist && isValid), onClick: handleSubmit(saveNewPassword), mbs: 12, "data-qa-type": 'e2e-encryption-save-password-button', children: t('Save_changes') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mb: 36, width: 'full' }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h4', fontScale: 'h4', mbe: 12, children: t('Reset_E2E_Key') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'p1', mbe: 12, dangerouslySetInnerHTML: { __html: t('E2E_Reset_Key_Explanation') } }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleResetE2eKey, "data-qa-type": 'e2e-encryption-reset-key-button', children: t('Reset_E2E_Key') })] })] })));
};
exports.default = EndToEnd;
