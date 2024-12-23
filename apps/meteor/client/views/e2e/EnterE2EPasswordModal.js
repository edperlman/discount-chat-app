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
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const EnterE2EPasswordModal = ({ onConfirm, onClose, onCancel, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [password, setPassword] = (0, react_1.useState)('');
    const [passwordError, setPasswordError] = (0, react_1.useState)();
    const handleChange = (0, react_1.useCallback)((e) => {
        e.target.value !== '' && setPasswordError(undefined);
        setPassword(e.currentTarget.value);
    }, [setPassword]);
    const handleConfirm = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        e.preventDefault();
        if (password === '') {
            setPasswordError(t('Invalid_pass'));
            return;
        }
        return onConfirm(password);
    });
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleConfirm }, props)), variant: 'warning', title: t('Enter_E2E_password'), icon: 'warning', cancelText: t('Do_It_Later'), confirmText: t('Enable_encryption'), onClose: onClose, onCancel: onCancel, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { dangerouslySetInnerHTML: { __html: t('E2E_password_request_text') } }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { mbs: 24, w: 'full', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, { error: passwordError, value: password, onChange: handleChange, placeholder: t('Please_enter_E2EE_password') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: passwordError })] }) })] }));
};
exports.default = EnterE2EPasswordModal;
