"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserDisplayName = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const getUserDisplayName_1 = require("../../lib/getUserDisplayName");
const useUserDisplayName = ({ name, username }) => {
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name');
    return (0, getUserDisplayName_1.getUserDisplayName)(name, username, !!useRealName);
};
exports.useUserDisplayName = useUserDisplayName;
