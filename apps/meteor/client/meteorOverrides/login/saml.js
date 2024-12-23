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
const random_1 = require("@rocket.chat/random");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../app/settings/client");
const overrideLoginMethod_1 = require("../../lib/2fa/overrideLoginMethod");
if (!accounts_base_1.Accounts.saml) {
    accounts_base_1.Accounts.saml = {};
}
const { logout } = meteor_1.Meteor;
meteor_1.Meteor.logout = function (...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const standardLogout = () => logout.apply(meteor_1.Meteor, args);
        if (!client_1.settings.get('SAML_Custom_Default')) {
            return standardLogout();
        }
        if (client_1.settings.get('SAML_Custom_Default_logout_behaviour') === 'Local') {
            console.info('SAML session not terminated, only the Rocket.Chat session is going to be killed');
            return standardLogout();
        }
        const provider = client_1.settings.get('SAML_Custom_Default_provider');
        if (provider && client_1.settings.get('SAML_Custom_Default_idp_slo_redirect_url')) {
            console.info('SAML session terminated via SLO');
            const { sdk } = yield Promise.resolve().then(() => __importStar(require('../../../app/utils/client/lib/SDKClient')));
            sdk
                .call('samlLogout', provider)
                .then((result) => {
                if (!result) {
                    logout.apply(meteor_1.Meteor);
                    return;
                }
                // Remove the userId from the client to prevent calls to the server while the logout is processed.
                // If the logout fails, the userId will be reloaded on the resume call
                accounts_base_1.Accounts.storageLocation.removeItem(accounts_base_1.Accounts.USER_ID_KEY);
                // A nasty bounce: 'result' has the SAML LogoutRequest but we need a proper 302 to redirected from the server.
                window.location.replace(meteor_1.Meteor.absoluteUrl(`_saml/sloRedirect/${provider}/?redirect=${encodeURIComponent(result)}`));
            })
                .catch(() => logout.apply(meteor_1.Meteor));
            return;
        }
        return standardLogout();
    });
};
meteor_1.Meteor.loginWithSaml = (options) => {
    options = options || {};
    const credentialToken = `id-${random_1.Random.id()}`;
    options.credentialToken = credentialToken;
    window.location.href = `_saml/authorize/${options.provider}/${options.credentialToken}`;
};
const loginWithSamlToken = (credentialToken) => (0, overrideLoginMethod_1.callLoginMethod)({
    methodArguments: [
        {
            saml: true,
            credentialToken,
        },
    ],
});
const loginWithSamlTokenAndTOTP = (credentialToken, code) => (0, overrideLoginMethod_1.callLoginMethod)({
    methodArguments: [
        {
            totp: {
                login: {
                    saml: true,
                    credentialToken,
                },
                code,
            },
        },
    ],
});
meteor_1.Meteor.loginWithSamlToken = (0, overrideLoginMethod_1.handleLogin)(loginWithSamlToken, loginWithSamlTokenAndTOTP);
