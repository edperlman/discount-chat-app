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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../GenericModal"));
const TwoFactorModal_1 = require("./TwoFactorModal");
const TwoFactorPasswordModal = ({ onConfirm, onClose, invalidAttempt }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [code, setCode] = (0, react_1.useState)('');
    const ref = (0, fuselage_hooks_1.useAutoFocus)();
    const onConfirmTotpCode = (e) => {
        e.preventDefault();
        onConfirm(code, TwoFactorModal_1.Method.PASSWORD);
    };
    const onChange = ({ currentTarget }) => {
        setCode(currentTarget.value);
    };
    const id = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: onConfirmTotpCode }, props)), onCancel: onClose, confirmText: t('Verify'), title: t('Please_enter_your_password'), onClose: onClose, variant: 'warning', icon: 'info', confirmDisabled: !code, children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { alignSelf: 'stretch', htmlFor: id, children: t('For_your_security_you_must_enter_your_current_password_to_continue') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, { id: id, ref: ref, value: code, onChange: onChange, placeholder: t('Password') }) }), invalidAttempt && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Invalid_password') })] }) }) }));
};
exports.default = TwoFactorPasswordModal;
