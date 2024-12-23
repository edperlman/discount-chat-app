"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidatePassword = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useValidatePassword = (password) => {
    const passwordVerifications = (0, ui_contexts_1.useVerifyPassword)(password);
    return (0, react_1.useMemo)(() => passwordVerifications.every(({ isValid }) => isValid), [passwordVerifications]);
};
exports.useValidatePassword = useValidatePassword;
