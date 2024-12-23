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
exports.CustomOAuth = void 0;
const random_1 = require("@rocket.chat/random");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const accounts_base_1 = require("meteor/accounts-base");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const oauth_1 = require("meteor/oauth");
const overrideLoginMethod_1 = require("../../../client/lib/2fa/overrideLoginMethod");
const loginServices_1 = require("../../../client/lib/loginServices");
const oauth_2 = require("../../../client/meteorOverrides/login/oauth");
const isURL_1 = require("../../../lib/utils/isURL");
// Request custom OAuth credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
class CustomOAuth {
    constructor(name, options) {
        this.name = name;
        this.name = name;
        if (!check_1.Match.test(this.name, String)) {
            throw new meteor_1.Meteor.Error('CustomOAuth: Name is required and must be String');
        }
        this.configure(options);
        accounts_base_1.Accounts.oauth.registerService(this.name);
        this.configureLogin();
    }
    configure(options) {
        if (!check_1.Match.test(options, Object)) {
            throw new meteor_1.Meteor.Error('CustomOAuth: Options is required and must be Object');
        }
        if (!check_1.Match.test(options.serverURL, String)) {
            throw new meteor_1.Meteor.Error('CustomOAuth: Options.serverURL is required and must be String');
        }
        if (!check_1.Match.test(options.authorizePath, String)) {
            options.authorizePath = '/oauth/authorize';
        }
        if (!check_1.Match.test(options.scope, String)) {
            options.scope = 'openid';
        }
        this.serverURL = options.serverURL;
        this.authorizePath = options.authorizePath;
        this.scope = options.scope;
        this.responseType = options.responseType || 'code';
        if (!(0, isURL_1.isURL)(this.authorizePath)) {
            this.authorizePath = this.serverURL + this.authorizePath;
        }
    }
    configureLogin() {
        const loginWithService = `loginWith${(0, string_helpers_1.capitalize)(String(this.name || ''))}`;
        const loginWithOAuthTokenAndTOTP = (0, oauth_2.createOAuthTotpLoginMethod)(this);
        const loginWithOAuthToken = (options, callback) => __awaiter(this, void 0, void 0, function* () {
            const credentialRequestCompleteCallback = accounts_base_1.Accounts.oauth.credentialRequestCompleteHandler(callback);
            yield this.requestCredential(options, credentialRequestCompleteCallback);
        });
        meteor_1.Meteor[loginWithService] = (options, callback) => {
            (0, overrideLoginMethod_1.overrideLoginMethod)(loginWithOAuthToken, [options], callback, loginWithOAuthTokenAndTOTP);
        };
    }
    requestCredential() {
        return __awaiter(this, arguments, void 0, function* (options = {}, credentialRequestCompleteCallback) {
            const config = yield loginServices_1.loginServices.loadLoginService(this.name);
            if (!config) {
                if (credentialRequestCompleteCallback) {
                    credentialRequestCompleteCallback(new accounts_base_1.Accounts.ConfigError());
                }
                return;
            }
            const credentialToken = random_1.Random.secret();
            const loginStyle = oauth_1.OAuth._loginStyle(this.name, config);
            const separator = this.authorizePath.indexOf('?') !== -1 ? '&' : '?';
            const loginUrl = `${this.authorizePath}${separator}client_id=${config.clientId}&redirect_uri=${encodeURIComponent(oauth_1.OAuth._redirectUri(this.name, config))}&response_type=${encodeURIComponent(this.responseType)}` +
                `&state=${encodeURIComponent(oauth_1.OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl))}&scope=${encodeURIComponent(this.scope)}`;
            oauth_1.OAuth.launchLogin({
                loginService: this.name,
                loginStyle,
                loginUrl,
                credentialRequestCompleteCallback,
                credentialToken,
                popupOptions: {
                    width: 900,
                    height: 450,
                },
            });
        });
    }
}
exports.CustomOAuth = CustomOAuth;
