"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createOAuthTotpLoginMethod = exports.convertError = void 0;
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const oauth_1 = require("meteor/oauth");
const isLoginCancelledError = (error) => error instanceof meteor_1.Meteor.Error && error.error === accounts_base_1.Accounts.LoginCancelledError.numericError;
const convertError = (error) => {
    if (isLoginCancelledError(error)) {
        return new accounts_base_1.Accounts.LoginCancelledError(error.reason);
    }
    return error;
};
exports.convertError = convertError;
let lastCredentialToken = null;
let lastCredentialSecret = null;
const meteorOAuthRetrieveCredentialSecret = oauth_1.OAuth._retrieveCredentialSecret;
oauth_1.OAuth._retrieveCredentialSecret = (credentialToken) => {
    let secret = meteorOAuthRetrieveCredentialSecret.call(oauth_1.OAuth, credentialToken);
    if (!secret) {
        const localStorageKey = `${oauth_1.OAuth._storageTokenPrefix}${credentialToken}`;
        secret = localStorage.getItem(localStorageKey);
        localStorage.removeItem(localStorageKey);
    }
    return secret;
};
const tryLoginAfterPopupClosed = (credentialToken, callback, totpCode, credentialSecret) => {
    credentialSecret = credentialSecret || oauth_1.OAuth._retrieveCredentialSecret(credentialToken) || null;
    const methodArgument = Object.assign({ oauth: {
            credentialToken,
            credentialSecret,
        } }, (typeof totpCode === 'string' &&
        !!totpCode && {
        totp: {
            code: totpCode,
        },
    }));
    lastCredentialToken = credentialToken;
    lastCredentialSecret = credentialSecret;
    if (typeof totpCode === 'string' && !!totpCode) {
        methodArgument.totp = {
            code: totpCode,
        };
    }
    accounts_base_1.Accounts.callLoginMethod({
        methodArguments: [methodArgument],
        userCallback: (err) => {
            callback === null || callback === void 0 ? void 0 : callback((0, exports.convertError)(err));
        },
    });
};
const credentialRequestCompleteHandler = (callback, totpCode) => (credentialTokenOrError) => {
    if (!credentialTokenOrError) {
        callback === null || callback === void 0 ? void 0 : callback(new meteor_1.Meteor.Error('No credential token passed'));
        return;
    }
    if (credentialTokenOrError instanceof Error) {
        callback === null || callback === void 0 ? void 0 : callback(credentialTokenOrError);
        return;
    }
    tryLoginAfterPopupClosed(credentialTokenOrError, callback, totpCode);
};
const createOAuthTotpLoginMethod = (provider) => (options, code, callback) => {
    if (lastCredentialToken && lastCredentialSecret) {
        tryLoginAfterPopupClosed(lastCredentialToken, callback, code, lastCredentialSecret);
    }
    else {
        const credentialRequestCompleteCallback = credentialRequestCompleteHandler(callback, code);
        provider.requestCredential(options, credentialRequestCompleteCallback);
    }
    lastCredentialToken = null;
    lastCredentialSecret = null;
};
exports.createOAuthTotpLoginMethod = createOAuthTotpLoginMethod;
accounts_base_1.Accounts.oauth.credentialRequestCompleteHandler = credentialRequestCompleteHandler;
accounts_base_1.Accounts.onPageLoadLogin((loginAttempt) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = loginAttempt === null || loginAttempt === void 0 ? void 0 : loginAttempt.error) === null || _a === void 0 ? void 0 : _a.error) !== 'totp-required') {
        return;
    }
    const { methodArguments } = loginAttempt;
    if (!(methodArguments === null || methodArguments === void 0 ? void 0 : methodArguments.length)) {
        return;
    }
    const oAuthArgs = methodArguments.find((arg) => arg.oauth);
    const { credentialToken, credentialSecret } = oAuthArgs.oauth;
    const cb = loginAttempt.userCallback;
    const { process2faReturn } = yield Promise.resolve().then(() => __importStar(require('../../lib/2fa/process2faReturn')));
    yield process2faReturn({
        error: loginAttempt.error,
        originalCallback: cb,
        onCode: (code) => {
            tryLoginAfterPopupClosed(credentialToken, cb, code, credentialSecret);
        },
        emailOrUsername: undefined,
        result: undefined,
    });
}));
