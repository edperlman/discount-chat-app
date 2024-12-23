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
exports.finishOAuthAuthorization = finishOAuthAuthorization;
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const meteor_1 = require("meteor/meteor");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
const oauthScopes_1 = require("../oauthScopes");
const getRedirectUri_1 = require("./getRedirectUri");
function finishOAuthAuthorization(code, state) {
    return __awaiter(this, void 0, void 0, function* () {
        if (server_1.settings.get('Cloud_Workspace_Registration_State') !== state) {
            throw new meteor_1.Meteor.Error('error-invalid-state', 'Invalid state provided', {
                method: 'cloud:finishOAuthAuthorization',
            });
        }
        const clientId = server_1.settings.get('Cloud_Workspace_Client_Id');
        const clientSecret = server_1.settings.get('Cloud_Workspace_Client_Secret');
        const scope = oauthScopes_1.userScopes.join(' ');
        let payload;
        try {
            const cloudUrl = server_1.settings.get('Cloud_Url');
            const response = yield (0, server_fetch_1.serverFetch)(`${cloudUrl}/api/oauth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                params: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'authorization_code',
                    scope,
                    code,
                    redirect_uri: (0, getRedirectUri_1.getRedirectUri)(),
                }),
            });
            if (!response.ok) {
                throw new Error((yield response.json()).error);
            }
            payload = yield response.json();
        }
        catch (err) {
            system_1.SystemLogger.error({
                msg: 'Failed to finish OAuth authorization with Rocket.Chat Cloud',
                url: '/api/oauth/token',
                err,
            });
            return false;
        }
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + payload.expires_in);
        const uid = meteor_1.Meteor.userId();
        if (!uid) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'cloud:finishOAuthAuthorization',
            });
        }
        yield models_1.Users.updateOne({ _id: uid }, {
            $set: {
                'services.cloud': {
                    accessToken: payload.access_token,
                    expiresAt,
                    scope: payload.scope,
                    tokenType: payload.token_type,
                    refreshToken: payload.refresh_token,
                },
            },
        });
        return true;
    });
}
