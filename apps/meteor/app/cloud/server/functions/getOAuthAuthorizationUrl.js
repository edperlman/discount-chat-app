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
exports.getOAuthAuthorizationUrl = getOAuthAuthorizationUrl;
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
const oauthScopes_1 = require("../oauthScopes");
const getRedirectUri_1 = require("./getRedirectUri");
function getOAuthAuthorizationUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        const state = random_1.Random.id();
        yield (0, auditedSettingUpdates_1.updateAuditedBySystem)({
            reason: 'getOAuthAuthorizationUrl',
        })(models_1.Settings.updateValueById, 'Cloud_Workspace_Registration_State', state);
        void (0, notifyListener_1.notifyOnSettingChangedById)('Cloud_Workspace_Registration_State');
        const cloudUrl = server_1.settings.get('Cloud_Url');
        const clientId = server_1.settings.get('Cloud_Workspace_Client_Id');
        const redirectUri = (0, getRedirectUri_1.getRedirectUri)();
        const scope = oauthScopes_1.userScopes.join(' ');
        return `${cloudUrl}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    });
}
