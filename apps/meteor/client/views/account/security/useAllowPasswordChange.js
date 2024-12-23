"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAllowPasswordChange = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useAllowPasswordChange = () => {
    var _a, _b;
    const user = (0, ui_contexts_1.useUser)();
    let allowPasswordChange = (0, ui_contexts_1.useSetting)('Accounts_AllowPasswordChange');
    const allowOAuthPasswordChange = (0, ui_contexts_1.useSetting)('Accounts_AllowPasswordChangeForOAuthUsers');
    const hasLocalPassword = Boolean((_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.password) === null || _b === void 0 ? void 0 : _b.exists);
    if (allowPasswordChange && !allowOAuthPasswordChange) {
        allowPasswordChange = hasLocalPassword;
    }
    return { allowPasswordChange, hasLocalPassword };
};
exports.useAllowPasswordChange = useAllowPasswordChange;
