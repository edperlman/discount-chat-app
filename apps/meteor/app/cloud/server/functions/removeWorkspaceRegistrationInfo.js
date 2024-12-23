"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWorkspaceRegistrationInfo = removeWorkspaceRegistrationInfo;
const models_1 = require("@rocket.chat/models");
const retrieveRegistrationStatus_1 = require("./retrieveRegistrationStatus");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
function removeWorkspaceRegistrationInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceRegistered } = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
        if (!workspaceRegistered) {
            return true;
        }
        yield models_1.WorkspaceCredentials.removeAllCredentials();
        const settingsIds = [
            'Cloud_Workspace_Id',
            'Cloud_Workspace_Name',
            'Cloud_Workspace_Client_Id',
            'Cloud_Workspace_Client_Secret',
            'Cloud_Workspace_Client_Secret_Expires_At',
            'Cloud_Workspace_PublicKey',
            'Cloud_Workspace_Registration_Client_Uri',
            'Show_Setup_Wizard',
        ];
        const promises = settingsIds.map((settingId) => {
            if (settingId === 'Show_Setup_Wizard') {
                return (0, auditedSettingUpdates_1.updateAuditedBySystem)({
                    reason: 'removeWorkspaceRegistrationInfo',
                })(models_1.Settings.updateValueById, 'Show_Setup_Wizard', 'in_progress');
            }
            return (0, auditedSettingUpdates_1.updateAuditedBySystem)({ reason: 'removeWorkspaceRegistrationInfo' })(models_1.Settings.resetValueById, settingId, null);
        });
        (yield Promise.all(promises)).forEach((value, index) => {
            if (value === null || value === void 0 ? void 0 : value.modifiedCount) {
                void (0, notifyListener_1.notifyOnSettingChangedById)(settingsIds[index]);
            }
        });
        return true;
    });
}
