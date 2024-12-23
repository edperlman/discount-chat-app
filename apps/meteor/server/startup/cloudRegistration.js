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
exports.ensureCloudWorkspaceRegistered = ensureCloudWorkspaceRegistered;
const models_1 = require("@rocket.chat/models");
function ensureCloudWorkspaceRegistered() {
    return __awaiter(this, void 0, void 0, function* () {
        const cloudWorkspaceClientId = yield models_1.Settings.getValueById('Cloud_Workspace_Client_Id');
        const cloudWorkspaceClientSecret = yield models_1.Settings.getValueById('Cloud_Workspace_Client_Secret');
        const showSetupWizard = yield models_1.Settings.getValueById('Show_Setup_Wizard');
        // skip if both fields are already set, which means the workspace is already registered
        if (!!cloudWorkspaceClientId && !!cloudWorkspaceClientSecret) {
            return;
        }
        // skip if the setup wizard still not completed
        if (showSetupWizard !== 'completed') {
            return;
        }
        // otherwise, set the setup wizard to in_progress forcing admins to complete the registration
        yield models_1.Settings.updateValueById('Show_Setup_Wizard', 'in_progress');
    });
}
