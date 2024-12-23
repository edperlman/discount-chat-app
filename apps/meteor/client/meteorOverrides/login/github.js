"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@rocket.chat/random");
const accounts_base_1 = require("meteor/accounts-base");
const github_oauth_1 = require("meteor/github-oauth");
const meteor_1 = require("meteor/meteor");
const oauth_1 = require("meteor/oauth");
const oauth_2 = require("./oauth");
const overrideLoginMethod_1 = require("../../lib/2fa/overrideLoginMethod");
const wrapRequestCredentialFn_1 = require("../../lib/wrapRequestCredentialFn");
const { loginWithGithub } = meteor_1.Meteor;
const loginWithGithubAndTOTP = (0, oauth_2.createOAuthTotpLoginMethod)(github_oauth_1.Github);
meteor_1.Meteor.loginWithGithub = (options, callback) => {
    (0, overrideLoginMethod_1.overrideLoginMethod)(loginWithGithub, [options], callback, loginWithGithubAndTOTP);
};
github_oauth_1.Github.requestCredential = (0, wrapRequestCredentialFn_1.wrapRequestCredentialFn)('github', ({ config, loginStyle, options, credentialRequestCompleteCallback }) => {
    var _a;
    const credentialToken = random_1.Random.secret();
    const scope = (options === null || options === void 0 ? void 0 : options.requestPermissions) || ['user:email'];
    const flatScope = scope.map(encodeURIComponent).join('+');
    let allowSignup = '';
    if ((_a = accounts_base_1.Accounts._options) === null || _a === void 0 ? void 0 : _a.forbidClientAccountCreation) {
        allowSignup = '&allow_signup=false';
    }
    const loginUrl = `https://github.com/login/oauth/authorize` +
        `?client_id=${config.clientId}` +
        `&scope=${flatScope}` +
        `&redirect_uri=${oauth_1.OAuth._redirectUri('github', config)}` +
        `&state=${oauth_1.OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)}${allowSignup}`;
    oauth_1.OAuth.launchLogin({
        loginService: 'github',
        loginStyle,
        loginUrl,
        credentialRequestCompleteCallback,
        credentialToken,
        popupOptions: { width: 900, height: 450 },
    });
});
