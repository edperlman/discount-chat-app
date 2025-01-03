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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const ActionConfirmModal = ({ isPassword, onConfirm, onCancel }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [inputText, setInputText] = (0, react_1.useState)('');
    const [inputError, setInputError] = (0, react_1.useState)();
    const handleChange = (0, react_1.useCallback)((e) => {
        e.target.value !== '' && setInputError(undefined);
        setInputText(e.currentTarget.value);
    }, [setInputText]);
    const handleSave = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        if (inputText === '') {
            setInputError(t('Invalid_field'));
            return;
        }
        onConfirm(inputText);
        onCancel();
    }, [inputText, onConfirm, onCancel, t]);
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSave }, props)), onClose: onCancel, onConfirm: handleSave, onCancel: onCancel, variant: 'danger', title: t('Delete_account?'), confirmText: t('Delete_account'), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 8, children: isPassword ? t('Enter_your_password_to_delete_your_account') : t('Enter_your_username_to_delete_your_account') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { w: 'full', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [isPassword && (0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, { value: inputText, onChange: handleChange }), !isPassword && (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: inputText, onChange: handleChange })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: inputError })] }) })] }));
};
exports.default = ActionConfirmModal;