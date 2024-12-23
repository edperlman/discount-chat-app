"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipExtensionPermission = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useVoipExtensionPermission = () => {
    const isVoipSettingEnabled = (0, ui_contexts_1.useSetting)('VoIP_TeamCollab_Enabled', false);
    const canManageVoipExtensions = (0, ui_contexts_1.usePermission)('manage-voip-extensions');
    return isVoipSettingEnabled && canManageVoipExtensions;
};
exports.useVoipExtensionPermission = useVoipExtensionPermission;
