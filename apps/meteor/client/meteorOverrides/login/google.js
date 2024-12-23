"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@rocket.chat/random");
const accounts_base_1 = require("meteor/accounts-base");
const google_oauth_1 = require("meteor/google-oauth");
const meteor_1 = require("meteor/meteor");
const oauth_1 = require("meteor/oauth");
const oauth_2 = require("./oauth");
const overrideLoginMethod_1 = require("../../lib/2fa/overrideLoginMethod");
const wrapRequestCredentialFn_1 = require("../../lib/wrapRequestCredentialFn");
const { loginWithGoogle } = meteor_1.Meteor;
const innerLoginWithGoogleAndTOTP = (0, oauth_2.createOAuthTotpLoginMethod)(google_oauth_1.Google);
const loginWithGoogleAndTOTP = (options, code, callback) => {
    if (meteor_1.Meteor.isCordova && google_oauth_1.Google.signIn) {
        // After 20 April 2017, Google OAuth login will no longer work from
        // a WebView, so Cordova apps must use Google Sign-In instead.
        // https://github.com/meteor/meteor/issues/8253
        google_oauth_1.Google.signIn(options, callback);
        return;
    } // Use Google's domain-specific login page if we want to restrict creation to
    // a particular email domain. (Don't use it if restrictCreationByEmailDomain
    // is a function.) Note that all this does is change Google's UI ---
    // accounts-base/accounts_server.js still checks server-side that the server
    // has the proper email address after the OAuth conversation.
    if (typeof accounts_base_1.Accounts._options.restrictCreationByEmailDomain === 'string') {
        options = Object.assign({}, options || {});
        options.loginUrlParameters = Object.assign({}, options.loginUrlParameters || {});
        options.loginUrlParameters.hd = accounts_base_1.Accounts._options.restrictCreationByEmailDomain;
    }
    innerLoginWithGoogleAndTOTP(options, code, callback);
};
meteor_1.Meteor.loginWithGoogle = (options, callback) => {
    (0, overrideLoginMethod_1.overrideLoginMethod)(loginWithGoogle, [options], callback, loginWithGoogleAndTOTP);
};
google_oauth_1.Google.requestCredential = (0, wrapRequestCredentialFn_1.wrapRequestCredentialFn)('google', ({ config, loginStyle, options: requestOptions, credentialRequestCompleteCallback }) => {
    const credentialToken = random_1.Random.secret();
    const options = requestOptions;
    const scope = ['email', ...(options.requestPermissions || ['profile'])].join(' ');
    const loginUrlParameters = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, options.loginUrlParameters), (options.requestOfflineToken !== undefined && {
        access_type: options.requestOfflineToken ? 'offline' : 'online',
    })), ((options.prompt || options.forceApprovalPrompt) && { prompt: options.prompt || 'consent' })), (options.loginHint && { login_hint: options.loginHint })), { response_type: 'code', client_id: config.clientId, scope, redirect_uri: oauth_1.OAuth._redirectUri('google', config), state: oauth_1.OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl) });
    Object.assign(loginUrlParameters, {
        response_type: 'code',
        client_id: config.clientId,
        scope,
        redirect_uri: oauth_1.OAuth._redirectUri('google', config),
        state: oauth_1.OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl),
    });
    const loginUrl = `https://accounts.google.com/o/oauth2/auth?${Object.keys(loginUrlParameters)
        .map((param) => `${encodeURIComponent(param)}=${encodeURIComponent(loginUrlParameters[param])}`)
        .join('&')}`;
    oauth_1.OAuth.launchLogin({
        loginService: 'google',
        loginStyle,
        loginUrl,
        credentialRequestCompleteCallback,
        credentialToken,
        popupOptions: { height: 600 },
    });
});
