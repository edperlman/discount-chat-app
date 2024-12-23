"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const DisableE2EEModal = ({ onConfirm, onCancel, roomType, canResetRoomKey, onResetRoomKey }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { icon: 'key', title: t('E2E_disable_encryption'), variant: 'warning', confirmText: t('E2E_disable_encryption'), onConfirm: onConfirm, onCancel: onCancel, onDismiss: () => undefined, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, is: 'p', children: (0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'E2E_disable_encryption_description', tOptions: { roomType } }) }), canResetRoomKey && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, is: 'p', children: t('E2E_disable_encryption_reset_keys_description') }), (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Accordion.Item, { title: t('E2E_reset_encryption_keys'), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, is: 'p', children: t('E2E_reset_encryption_keys_description') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, danger: true, small: true, onClick: onResetRoomKey, children: t('E2E_reset_encryption_keys_button', { roomType }) })] }) })] }))] }));
};
exports.default = DisableE2EEModal;
