"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccountProfileSettings = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useAccountProfileSettings = () => {
    const allowRealNameChange = (0, ui_contexts_1.useSetting)('Accounts_AllowRealNameChange', true);
    const allowUserStatusMessageChange = (0, ui_contexts_1.useSetting)('Accounts_AllowUserStatusMessageChange', true);
    const canChangeUsername = (0, ui_contexts_1.useSetting)('Accounts_AllowUsernameChange', true);
    const allowEmailChange = (0, ui_contexts_1.useSetting)('Accounts_AllowEmailChange', true);
    const allowUserAvatarChange = (0, ui_contexts_1.useSetting)('Accounts_AllowUserAvatarChange', true);
    const requireName = (0, ui_contexts_1.useSetting)('Accounts_RequireNameForSignUp', true);
    const namesRegexSetting = (0, ui_contexts_1.useSetting)('UTF8_User_Names_Validation', '[0-9a-zA-Z-_.]+');
    const namesRegex = (0, react_1.useMemo)(() => new RegExp(`^${namesRegexSetting}$`), [namesRegexSetting]);
    return {
        allowRealNameChange,
        allowUserStatusMessageChange,
        allowEmailChange,
        allowUserAvatarChange,
        canChangeUsername,
        requireName,
        namesRegex,
    };
};
exports.useAccountProfileSettings = useAccountProfileSettings;
