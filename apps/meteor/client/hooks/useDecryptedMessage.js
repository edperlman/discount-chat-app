"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDecryptedMessage = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const rocketchat_e2e_1 = require("../../app/e2e/client/rocketchat.e2e");
const useDecryptedMessage = (message) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [decryptedMessage, setDecryptedMessage] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(t('E2E_message_encrypted_placeholder')));
    (0, react_1.useEffect)(() => {
        if (!(0, core_typings_1.isE2EEMessage)(message)) {
            return;
        }
        rocketchat_e2e_1.e2e.decryptMessage(message).then((decryptedMsg) => {
            var _a;
            if (decryptedMsg.msg) {
                setDecryptedMessage(decryptedMsg.msg);
            }
            if (decryptedMsg.attachments && ((_a = decryptedMsg.attachments) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                if (decryptedMsg.attachments[0].description) {
                    setDecryptedMessage(decryptedMsg.attachments[0].description);
                }
                else {
                    setDecryptedMessage(t('Message_with_attachment'));
                }
            }
        });
    }, [message, t, setDecryptedMessage]);
    return (0, core_typings_1.isE2EEMessage)(message) ? decryptedMessage : message.msg;
};
exports.useDecryptedMessage = useDecryptedMessage;
