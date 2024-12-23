"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useClipboardWithToast;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_i18next_1 = require("react-i18next");
function useClipboardWithToast(text) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, fuselage_hooks_1.useClipboard)(text, {
        onCopySuccess: (0, fuselage_hooks_1.useMutableCallback)(() => dispatchToastMessage({ type: 'success', message: t('Copied') })),
        onCopyError: (0, fuselage_hooks_1.useMutableCallback)((e) => dispatchToastMessage({ type: 'error', message: e })),
    });
}
