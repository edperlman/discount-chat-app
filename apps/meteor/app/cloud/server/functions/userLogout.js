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
exports.userLogout = userLogout;
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const retrieveRegistrationStatus_1 = require("./retrieveRegistrationStatus");
const userLoggedOut_1 = require("./userLoggedOut");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
function userLogout(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { workspaceRegistered } = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
        if (!workspaceRegistered) {
            return '';
        }
        if (!userId) {
            return '';
        }
        const user = yield models_1.Users.findOneById(userId);
        if ((_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.cloud) === null || _b === void 0 ? void 0 : _b.refreshToken) {
            try {
                const clientId = server_1.settings.get('Cloud_Workspace_Client_Id');
                if (!clientId) {
                    return '';
                }
                const clientSecret = server_1.settings.get('Cloud_Workspace_Client_Secret');
                const { refreshToken } = user.services.cloud;
                const cloudUrl = server_1.settings.get('Cloud_Url');
                yield (0, server_fetch_1.serverFetch)(`${cloudUrl}/api/oauth/revoke`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    params: {
                        client_id: clientId,
                        client_secret: clientSecret,
                        token: refreshToken,
                        token_type_hint: 'refresh_token',
                    },
                });
            }
            catch (err) {
                system_1.SystemLogger.error({
                    msg: 'Failed to get Revoke refresh token to logout of Rocket.Chat Cloud',
                    url: '/api/oauth/revoke',
                    err,
                });
            }
        }
        return (0, userLoggedOut_1.userLoggedOut)(userId);
    });
}
