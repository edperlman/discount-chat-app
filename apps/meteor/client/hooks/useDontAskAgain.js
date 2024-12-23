"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDontAskAgain = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useDontAskAgain = (action) => {
    const dontAskAgainList = (0, ui_contexts_1.useUserPreference)('dontAskAgainList');
    const shouldNotAskAgain = !!(dontAskAgainList === null || dontAskAgainList === void 0 ? void 0 : dontAskAgainList.filter(({ action: currentAction }) => action === currentAction).length);
    return shouldNotAskAgain;
};
exports.useDontAskAgain = useDontAskAgain;
