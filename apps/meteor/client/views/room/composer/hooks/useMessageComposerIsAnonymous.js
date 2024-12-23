"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageComposerIsAnonymous = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useMessageComposerIsAnonymous = () => {
    const isAnonymousReadEnabled = (0, ui_contexts_1.useSetting)('Accounts_AllowAnonymousRead');
    const isAnonymousWriteEnabled = (0, ui_contexts_1.useSetting)('Accounts_AllowAnonymousWrite');
    const uid = (0, ui_contexts_1.useUserId)();
    if (!uid && !isAnonymousReadEnabled && !isAnonymousWriteEnabled) {
        throw new Error('Anonymous access is disabled');
    }
    return Boolean(!uid);
};
exports.useMessageComposerIsAnonymous = useMessageComposerIsAnonymous;
