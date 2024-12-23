"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppUiKitInteraction = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useAppUiKitInteraction = (handleServerInteraction) => {
    const notifyUser = (0, ui_contexts_1.useStream)('notify-user');
    const uid = (0, ui_contexts_1.useUserId)();
    const handle = (0, fuselage_hooks_1.useEffectEvent)(handleServerInteraction);
    (0, react_1.useEffect)(() => {
        if (!uid) {
            return;
        }
        return notifyUser(`${uid}/uiInteraction`, handle);
    }, [notifyUser, uid, handle]);
};
exports.useAppUiKitInteraction = useAppUiKitInteraction;
