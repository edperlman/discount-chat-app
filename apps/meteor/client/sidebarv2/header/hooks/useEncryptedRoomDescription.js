"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEncryptedRoomDescription = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
const useEncryptedRoomDescription = (roomType) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const e2eEnabled = (0, ui_contexts_1.useSetting)('E2E_Enable');
    const e2eEnabledForPrivateByDefault = (0, ui_contexts_1.useSetting)('E2E_Enabled_Default_PrivateRooms');
    return ({ isPrivate, broadcast, encrypted }) => {
        if (!e2eEnabled) {
            return t('Not_available_for_this_workspace');
        }
        if (!isPrivate) {
            return t('Encrypted_not_available', { roomType });
        }
        if (broadcast) {
            return t('Not_available_for_broadcast', { roomType });
        }
        if (e2eEnabledForPrivateByDefault || encrypted) {
            return t('Encrypted_messages', { roomType });
        }
        return t('Encrypted_messages_false');
    };
};
exports.useEncryptedRoomDescription = useEncryptedRoomDescription;
