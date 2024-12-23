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
exports.getWorkspaceAccessTokenWithScope = getWorkspaceAccessTokenWithScope;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
const oauthScopes_1 = require("../oauthScopes");
const getRedirectUri_1 = require("./getRedirectUri");
const getWorkspaceAccessToken_1 = require("./getWorkspaceAccessToken");
const removeWorkspaceRegistrationInfo_1 = require("./removeWorkspaceRegistrationInfo");
const retrieveRegistrationStatus_1 = require("./retrieveRegistrationStatus");
function getWorkspaceAccessTokenWithScope(_a) {
    return __awaiter(this, arguments, void 0, function* ({ scope = '', throwOnError = false, }) {
        const { workspaceRegistered } = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
        const tokenResponse = { token: '', expiresAt: new Date(), scope: '' };
        if (!workspaceRegistered) {
            return tokenResponse;
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const client_id = server_1.settings.get('Cloud_Workspace_Client_Id');
        if (!client_id) {
            return tokenResponse;
        }
        if (scope === '') {
            scope = oauthScopes_1.workspaceScopes.join(' ');
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const client_secret = server_1.settings.get('Cloud_Workspace_Client_Secret');
        const redirectUri = (0, getRedirectUri_1.getRedirectUri)();
        let payload;
        try {
            const body = new URLSearchParams();
            body.append('client_id', client_id);
            body.append('client_secret', client_secret);
            body.append('scope', scope);
            body.append('grant_type', 'client_credentials');
            body.append('redirect_uri', redirectUri);
            const cloudUrl = server_1.settings.get('Cloud_Url');
            const response = yield (0, server_fetch_1.serverFetch)(`${cloudUrl}/api/oauth/token`, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                body,
                timeout: 5000,
            });
            payload = yield response.json();
            if (response.status >= 400) {
                if (payload.error === 'oauth_invalid_client_credentials') {
                    throw new getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenError();
                }
            }
            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + payload.expires_in);
            return {
                token: payload.access_token,
                expiresAt,
                scope: payload.scope,
            };
        }
        catch (err) {
            if (err instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenError) {
                system_1.SystemLogger.error('Server has been unregistered from cloud');
                void (0, removeWorkspaceRegistrationInfo_1.removeWorkspaceRegistrationInfo)();
                if (throwOnError) {
                    throw err;
                }
            }
        }
        return tokenResponse;
    });
}
