"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const meteor_developer_oauth_1 = require("meteor/meteor-developer-oauth");
const oauth_1 = require("meteor/oauth");
const oauth_2 = require("./oauth");
const overrideLoginMethod_1 = require("../../lib/2fa/overrideLoginMethod");
const wrapRequestCredentialFn_1 = require("../../lib/wrapRequestCredentialFn");
const { loginWithMeteorDeveloperAccount } = meteor_1.Meteor;
const loginWithMeteorDeveloperAccountAndTOTP = (0, oauth_2.createOAuthTotpLoginMethod)(meteor_developer_oauth_1.MeteorDeveloperAccounts);
meteor_1.Meteor.loginWithMeteorDeveloperAccount = (options, callback) => {
    (0, overrideLoginMethod_1.overrideLoginMethod)(loginWithMeteorDeveloperAccount, [options], callback, loginWithMeteorDeveloperAccountAndTOTP);
};
meteor_developer_oauth_1.MeteorDeveloperAccounts.requestCredential = (0, wrapRequestCredentialFn_1.wrapRequestCredentialFn)('meteor-developer', ({ config, loginStyle, options: requestOptions, credentialRequestCompleteCallback }) => {
    const options = requestOptions;
    const credentialToken = Random.secret();
    let loginUrl = `${meteor_developer_oauth_1.MeteorDeveloperAccounts._server}/oauth2/authorize?` +
        `state=${oauth_1.OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)}` +
        `&response_type=code&` +
        `client_id=${config.clientId}${options.details ? `&details=${options.details}` : ''}`;
    if (options.loginHint) {
        loginUrl += `&user_email=${encodeURIComponent(options.loginHint)}`;
    }
    loginUrl += `&redirect_uri=${oauth_1.OAuth._redirectUri('meteor-developer', config)}`;
    oauth_1.OAuth.launchLogin({
        loginService: 'meteor-developer',
        loginStyle,
        loginUrl,
        credentialRequestCompleteCallback,
        credentialToken,
        popupOptions: { width: 497, height: 749 },
    });
});
