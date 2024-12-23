"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@rocket.chat/random");
const meteor_1 = require("meteor/meteor");
const oauth_1 = require("meteor/oauth");
const twitter_oauth_1 = require("meteor/twitter-oauth");
const oauth_2 = require("./oauth");
const overrideLoginMethod_1 = require("../../lib/2fa/overrideLoginMethod");
const wrapRequestCredentialFn_1 = require("../../lib/wrapRequestCredentialFn");
const { loginWithTwitter } = meteor_1.Meteor;
const loginWithTwitterAndTOTP = (0, oauth_2.createOAuthTotpLoginMethod)(twitter_oauth_1.Twitter);
meteor_1.Meteor.loginWithTwitter = (options, callback) => {
    (0, overrideLoginMethod_1.overrideLoginMethod)(loginWithTwitter, [options], callback, loginWithTwitterAndTOTP);
};
twitter_oauth_1.Twitter.requestCredential = (0, wrapRequestCredentialFn_1.wrapRequestCredentialFn)('twitter', ({ loginStyle, options: requestOptions, credentialRequestCompleteCallback }) => {
    const options = requestOptions;
    const credentialToken = random_1.Random.secret();
    let loginPath = `_oauth/twitter/?requestTokenAndRedirect=true&state=${oauth_1.OAuth._stateParam(loginStyle, credentialToken, options === null || options === void 0 ? void 0 : options.redirectUrl)}`;
    if (meteor_1.Meteor.isCordova) {
        loginPath += '&cordova=true';
        if (/Android/i.test(navigator.userAgent)) {
            loginPath += '&android=true';
        }
    }
    // Support additional, permitted parameters
    if (options) {
        const hasOwn = Object.prototype.hasOwnProperty;
        twitter_oauth_1.Twitter.validParamsAuthenticate.forEach((param) => {
            if (hasOwn.call(options, param)) {
                loginPath += `&${param}=${encodeURIComponent(options[param])}`;
            }
        });
    }
    const loginUrl = meteor_1.Meteor.absoluteUrl(loginPath);
    oauth_1.OAuth.launchLogin({
        loginService: 'twitter',
        loginStyle,
        loginUrl,
        credentialRequestCompleteCallback,
        credentialToken,
    });
});
