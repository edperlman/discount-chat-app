"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUiKitActionManager = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useUiKitActionManager = () => {
    const actionManager = (0, react_1.useContext)(ui_contexts_1.ActionManagerContext);
    if (!actionManager) {
        throw new Error('ActionManagerContext is not provided');
    }
    return actionManager;
};
exports.useUiKitActionManager = useUiKitActionManager;
