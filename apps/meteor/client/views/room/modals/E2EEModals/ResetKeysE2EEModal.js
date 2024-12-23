"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const toast_1 = require("../../../../lib/toast");
const useE2EEResetRoomKey_1 = require("../../hooks/useE2EEResetRoomKey");
const E2EE_RESET_KEY_LINK = 'https://go.rocket.chat/i/e2ee-guide';
const ResetKeysE2EEModal = ({ roomType, roomId, onCancel }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const resetRoomKeyMutation = (0, useE2EEResetRoomKey_1.useE2EEResetRoomKey)();
    const handleResetRoomKey = () => {
        resetRoomKeyMutation.mutate({ roomId }, {
            onSuccess: () => {
                (0, toast_1.dispatchToastMessage)({ type: 'success', message: t('E2E_reset_encryption_keys_success') });
            },
            onError: () => {
                (0, toast_1.dispatchToastMessage)({ type: 'error', message: t('E2E_reset_encryption_keys_error') });
            },
            onSettled: () => {
                onCancel();
            },
        });
    };
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { icon: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { color: 'danger', name: 'key' }), title: t('E2E_reset_encryption_keys'), variant: 'danger', confirmText: t('E2E_reset_encryption_keys'), dontAskAgain: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.FooterAnnotation, { children: t('This_action_cannot_be_undone') }), onCancel: onCancel, onConfirm: handleResetRoomKey, onDismiss: () => undefined, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, is: 'p', children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'E2E_reset_encryption_keys_modal_description', tOptions: { roomType }, children: ["Resetting E2EE keys is only recommend if no ", roomType, " member has a valid key to regain access to the previously encrypted content. All members may lose access to previously encrypted content.", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: E2EE_RESET_KEY_LINK, children: "Learn more" }), " about resetting encryption keys. Proceed with caution."] }) }) }));
};
exports.default = ResetKeysE2EEModal;
