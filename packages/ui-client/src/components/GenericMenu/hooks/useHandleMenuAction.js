"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandleMenuAction = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const useHandleMenuAction = (items, callbackAction) => (0, fuselage_hooks_1.useEffectEvent)((id) => {
    var _a;
    const item = items.find((item) => item.id === id && !!item.onClick);
    if (item) {
        (_a = item.onClick) === null || _a === void 0 ? void 0 : _a.call(item);
        callbackAction === null || callbackAction === void 0 ? void 0 : callbackAction();
    }
});
exports.useHandleMenuAction = useHandleMenuAction;
