"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCoreRoomActions = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_1 = require("../../../../ui");
const useCoreRoomActions = () => {
    return (0, fuselage_hooks_1.useStableArray)(ui_1.roomActionHooks.map((roomActionHook) => roomActionHook()).filter((roomAction) => !!roomAction));
};
exports.useCoreRoomActions = useCoreRoomActions;
