"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@rocket.chat/random");
const facebook_oauth_1 = require("meteor/facebook-oauth");
const meteor_1 = require("meteor/meteor");
const oauth_1 = require("meteor/oauth");
const oauth_2 = require("./oauth");
const overrideLoginMethod_1 = require("../../lib/2fa/overrideLoginMethod");
const wrapRequestCredentialFn_1 = require("../../lib/wrapRequestCredentialFn");
const { loginWithFacebook } = meteor_1.Meteor;
const loginWithFacebookAndTOTP = (0, oauth_2.createOAuthTotpLoginMethod)(facebook_oauth_1.Facebook);
meteor_1.Meteor.loginWithFacebook = (options, callback) => {
    (0, overrideLoginMethod_1.overrideLoginMethod)(loginWithFacebook, [options], callback, loginWithFacebookAndTOTP);
};
facebook_oauth_1.Facebook.requestCredential = (0, wrapRequestCredentialFn_1.wrapRequestCredentialFn)('facebook', ({ config, loginStyle, options: requestOptions, credentialRequestCompleteCallback }) => {
    var _a, _b, _c, _d;
    const options = requestOptions;
    const credentialToken = random_1.Random.secret();
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    const display = mobile ? 'touch' : 'popup';
    const scope = (options === null || options === void 0 ? void 0 : options.requestPermissions) ? options.requestPermissions.join(',') : 'email';
    const API_VERSION = ((_d = (_c = (_b = (_a = meteor_1.Meteor.settings) === null || _a === void 0 ? void 0 : _a.public) === null || _b === void 0 ? void 0 : _b.packages) === null || _c === void 0 ? void 0 : _c['facebook-oauth']) === null || _d === void 0 ? void 0 : _d.apiVersion) || '17.0';
    const loginUrlParameters = Object.assign({ client_id: config.appId, redirect_uri: oauth_1.OAuth._redirectUri('facebook', config, options.params, options.absoluteUrlOptions), display,
        scope, state: oauth_1.OAuth._stateParam(loginStyle, credentialToken, options === null || options === void 0 ? void 0 : options.redirectUrl) }, (options.auth_type && { auth_type: options.auth_type }));
    const loginUrl = `https://www.facebook.com/v${API_VERSION}/dialog/oauth?${Object.keys(loginUrlParameters)
        .map((param) => `${encodeURIComponent(param)}=${encodeURIComponent(loginUrlParameters[param])}`)
        .join('&')}`;
    oauth_1.OAuth.launchLogin({
        loginService: 'facebook',
        loginStyle,
        loginUrl,
        credentialRequestCompleteCallback,
        credentialToken,
    });
});
