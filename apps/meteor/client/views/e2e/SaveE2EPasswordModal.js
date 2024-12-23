"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const DOCS_URL = 'https://go.rocket.chat/i/e2ee-guide';
const SaveE2EPasswordModal = ({ randomPassword, onClose, onCancel, onConfirm }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { copy, hasCopied } = (0, fuselage_hooks_1.useClipboard)(randomPassword);
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { onClose: onClose, onCancel: onCancel, onConfirm: onConfirm, cancelText: t('Do_It_Later'), confirmText: t('I_Saved_My_Password'), variant: 'warning', title: t('Save_your_encryption_password'), annotation: t('You_can_do_from_account_preferences'), children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: { __html: t('E2E_password_reveal_text', { randomPassword }) } }), (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: DOCS_URL, mis: 4, children: t('Learn_more_about_E2EE') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontWeight: 'bold', mb: 20, children: t('E2E_password_save_text') }), (0, jsx_runtime_1.jsx)("p", { children: t('Your_E2EE_password_is') }), (0, jsx_runtime_1.jsx)(fuselage_1.CodeSnippet, { buttonText: hasCopied ? t('Copied') : t('Copy'), buttonDisabled: hasCopied, onClick: () => copy(), mbs: 8, children: randomPassword })] }));
};
exports.default = SaveE2EPasswordModal;
