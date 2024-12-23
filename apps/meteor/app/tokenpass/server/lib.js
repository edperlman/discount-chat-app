"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const custom_oauth_server_1 = require("../../custom-oauth/server/custom_oauth_server");
const server_1 = require("../../settings/server");
const config = {
    serverURL: '',
    identityPath: '/oauth/user',
    authorizePath: '/oauth/authorize',
    tokenPath: '/oauth/access-token',
    scope: 'user',
    tokenSentVia: 'payload',
    usernameField: 'username',
    mergeUsers: true,
    addAutopublishFields: {
        forLoggedInUser: ['services.tokenpass'],
        forOtherUsers: ['services.tokenpass.name'],
    },
    accessTokenParam: 'access_token',
};
const Tokenpass = new custom_oauth_server_1.CustomOAuth('tokenpass', config);
meteor_1.Meteor.startup(() => {
    server_1.settings.watch('API_Tokenpass_URL', (value) => {
        config.serverURL = value;
        Tokenpass.configure(config);
    });
});
