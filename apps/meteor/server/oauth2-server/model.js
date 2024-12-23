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
exports.Model = void 0;
const models_1 = require("@rocket.chat/models");
class Model {
    constructor(config = {}) {
        this.grants = ['authorization_code', 'refresh_token'];
        this.debug = !!config.debug;
    }
    verifyScope(token, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug === true) {
                console.log('[OAuth2Server]', 'in grantTypeAllowed (clientId:', token.client.id, ', grantType:', `${scope})`);
            }
            if (!Array.isArray(scope)) {
                scope = [scope];
            }
            const allowed = this.grants.filter((t) => scope.includes(t)).length > 0;
            return allowed;
        });
    }
    getAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug === true) {
                console.log('[OAuth2Server]', 'in getAccessToken (bearerToken:', accessToken, ')');
            }
            const token = yield models_1.OAuthAccessTokens.findOneByAccessToken(accessToken);
            if (!token) {
                return;
            }
            const client = yield this.getClient(token.clientId);
            if (!client) {
                throw new Error('Invalid clientId');
            }
            const result = {
                accessToken: token.accessToken,
                client,
                user: {
                    id: token.userId,
                },
            };
            return result;
        });
    }
    getClient(clientId, clientSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug === true) {
                console.log('[OAuth2Server]', 'in getClient (clientId:', clientId, ', clientSecret:', clientSecret, ')');
            }
            let client;
            if (clientSecret == null) {
                client = yield models_1.OAuthApps.findOneActiveByClientId(clientId);
            }
            else {
                client = yield models_1.OAuthApps.findOneActiveByClientIdAndClientSecret(clientId, clientSecret);
            }
            if (!client) {
                throw new Error('Invalid clientId');
            }
            const result = {
                grants: this.grants,
                redirectUris: client.redirectUri.split(','),
                id: client.clientId,
            };
            return result;
        });
    }
    getAuthorizationCode(authorizationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug === true) {
                console.log('[OAuth2Server]', `in getAuthorizationCode (authCode: ${authorizationCode})`);
            }
            const code = yield models_1.OAuthAuthCodes.findOneByAuthCode(authorizationCode);
            if (!code) {
                throw new Error('Invalid authCode');
            }
            const client = yield this.getClient(code.clientId);
            if (!client) {
                throw new Error('Invalid clientId');
            }
            const authCode = {
                authorizationCode,
                expiresAt: code.expires,
                user: {
                    id: code.userId,
                },
                client: {
                    id: client.id,
                    grants: client.grants,
                },
                redirectUri: code.redirectUri,
            };
            return authCode;
        });
    }
    saveAuthorizationCode(code, client, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug === true) {
                console.log('[OAuth2Server]', 'in saveAuthCode (code:', code.authorizationCode, ', clientId:', client.id, ', expires:', code.expiresAt, ', user:', user, ')');
            }
            yield models_1.OAuthAuthCodes.updateOne({ authCode: code.authorizationCode }, {
                $set: {
                    authCode: code.authorizationCode,
                    clientId: client.id,
                    userId: user.id,
                    expires: code.expiresAt,
                    redirectUri: code.redirectUri,
                },
            }, { upsert: true });
            const newCode = Object.assign(Object.assign({}, code), { client,
                user });
            return newCode;
        });
    }
    saveToken(token, client, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug === true) {
                console.log('[OAuth2Server]', 'in saveToken (token:', token.accessToken, ', refreshToken:', token.refreshToken, ', clientId:', client.id, ', user:', user, ', expires:', token.accessTokenExpiresAt, ', refreshTokenExpires:', token.refreshTokenExpiresAt, ')');
            }
            const tokenId = (yield models_1.OAuthAccessTokens.insertOne({
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                expires: token.accessTokenExpiresAt,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                clientId: client.id,
                userId: user.id,
            })).insertedId;
            const result = {
                id: tokenId,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                accessTokenExpiresAt: token.accessTokenExpiresAt,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                client,
                user,
            };
            return result;
        });
    }
    getRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug === true) {
                console.log('[OAuth2Server]', `in getRefreshToken (refreshToken: ${refreshToken})`);
            }
            // Keep compatibility with old collection
            // Deprecated: Remove on next major within a migration
            const token = (yield models_1.OAuthAccessTokens.findOneByRefreshToken(refreshToken)) || (yield models_1.OAuthRefreshTokens.findOneByRefreshToken(refreshToken));
            if (!token) {
                throw new Error('Invalid token');
            }
            const client = yield this.getClient(token.clientId);
            if (!client) {
                throw new Error('Invalid clientId');
            }
            const result = {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                refreshToken: token.refreshToken,
                // Keep compatibility with old collection
                // Deprecated: Remove on next major within a migration
                refreshTokenExpiresAt: 'refreshTokenExpiresAt' in token ? token.refreshTokenExpiresAt : token.expires,
                client: {
                    id: client.id,
                    grants: client.grants,
                },
                user: {
                    id: token.userId,
                },
            };
            return result;
        });
    }
    revokeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug === true) {
                console.log('[OAuth2Server]', `in revokeToken (token: ${token.accessToken})`);
            }
            if (token.refreshToken) {
                yield models_1.OAuthAccessTokens.deleteOne({ refreshToken: token.refreshToken });
                // Keep compatibility with old collection
                // Deprecated: Remove on next major within a migration
                yield models_1.OAuthRefreshTokens.deleteOne({ refreshToken: token.refreshToken });
            }
            if (token.accessToken) {
                yield models_1.OAuthAccessTokens.deleteOne({ accessToken: token.accessToken });
            }
            return true;
        });
    }
    revokeAuthorizationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug === true) {
                console.log('[OAuth2Server]', `in revokeAuthorizationCode (code: ${code.authorizationCode})`);
            }
            yield models_1.OAuthAuthCodes.deleteOne({ authCode: code.authorizationCode });
            return true;
        });
    }
}
exports.Model = Model;
