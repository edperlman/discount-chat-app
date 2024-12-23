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
exports.generateWorkspaceBearerHttpHeader = exports.generateWorkspaceBearerHttpHeaderOrThrow = exports.CloudWorkspaceAccessTokenEmptyError = exports.isAbortError = exports.CloudWorkspaceAccessTokenError = void 0;
exports.getWorkspaceAccessToken = getWorkspaceAccessToken;
exports.getWorkspaceAccessTokenOrThrow = getWorkspaceAccessTokenOrThrow;
const models_1 = require("@rocket.chat/models");
const system_1 = require("../../../../server/lib/logger/system");
const oauthScopes_1 = require("../oauthScopes");
const getWorkspaceAccessTokenWithScope_1 = require("./getWorkspaceAccessTokenWithScope");
const retrieveRegistrationStatus_1 = require("./retrieveRegistrationStatus");
const hasWorkspaceAccessTokenExpired = (credentials) => new Date() >= credentials.expirationDate;
/**
 * Returns the access token for the workspace, if it is expired or forceNew is true, it will get a new one
 * and save it to the database, therefore if this function does not throw an error, it will always return a valid token.
 *
 * @param {boolean} forceNew - If true, it will get a new token even if the current one is not expired
 * @param {string} scope - The scope of the token to get
 * @param {boolean} save - If true, it will save the new token to the database
 * @throws {CloudWorkspaceAccessTokenError} If the workspace is not registered (no credentials in the database)
 *
 * @returns string - A valid access token for the workspace
 */
function getWorkspaceAccessToken() {
    return __awaiter(this, arguments, void 0, function* (forceNew = false, scope = '', save = true, throwOnError = false) {
        const { workspaceRegistered } = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
        if (!workspaceRegistered) {
            return '';
        }
        // Note: If no scope is given, it means we should assume the default scope, we store the default scopes
        //       in the global variable workspaceScopes.
        if (scope === '') {
            scope = oauthScopes_1.workspaceScopes.join(' ');
        }
        const workspaceCredentials = yield models_1.WorkspaceCredentials.getCredentialByScope(scope);
        if (workspaceCredentials && !hasWorkspaceAccessTokenExpired(workspaceCredentials) && !forceNew) {
            system_1.SystemLogger.debug(`Workspace credentials cache hit using scope: ${scope}. Avoiding generating a new access token from cloud services.`);
            return workspaceCredentials.accessToken;
        }
        system_1.SystemLogger.debug(`Workspace credentials cache miss using scope: ${scope}, fetching new access token from cloud services.`);
        const accessToken = yield (0, getWorkspaceAccessTokenWithScope_1.getWorkspaceAccessTokenWithScope)({ scope, throwOnError });
        if (save) {
            yield models_1.WorkspaceCredentials.updateCredentialByScope({
                scope: accessToken.scope,
                accessToken: accessToken.token,
                expirationDate: accessToken.expiresAt,
            });
        }
        return accessToken.token;
    });
}
class CloudWorkspaceAccessTokenError extends Error {
    constructor() {
        super('Could not get workspace access token');
    }
}
exports.CloudWorkspaceAccessTokenError = CloudWorkspaceAccessTokenError;
const isAbortError = (error) => {
    if (typeof error !== 'object' || error === null) {
        return false;
    }
    return 'type' in error && error.type === 'AbortError';
};
exports.isAbortError = isAbortError;
class CloudWorkspaceAccessTokenEmptyError extends Error {
    constructor() {
        super('Workspace access token is empty');
    }
}
exports.CloudWorkspaceAccessTokenEmptyError = CloudWorkspaceAccessTokenEmptyError;
function getWorkspaceAccessTokenOrThrow() {
    return __awaiter(this, arguments, void 0, function* (forceNew = false, scope = '', save = true) {
        const token = yield getWorkspaceAccessToken(forceNew, scope, save, true);
        if (!token) {
            throw new CloudWorkspaceAccessTokenEmptyError();
        }
        return token;
    });
}
const generateWorkspaceBearerHttpHeaderOrThrow = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (forceNew = false, scope = '', save = true) {
    const token = yield getWorkspaceAccessTokenOrThrow(forceNew, scope, save);
    return {
        Authorization: `Bearer ${token}`,
    };
});
exports.generateWorkspaceBearerHttpHeaderOrThrow = generateWorkspaceBearerHttpHeaderOrThrow;
const generateWorkspaceBearerHttpHeader = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (forceNew = false, scope = '', save = true) {
    const token = yield getWorkspaceAccessToken(forceNew, scope, save);
    if (!token) {
        return undefined;
    }
    return {
        Authorization: `Bearer ${token}`,
    };
});
exports.generateWorkspaceBearerHttpHeader = generateWorkspaceBearerHttpHeader;
