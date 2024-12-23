"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const CustomOAuth_1 = require("../../custom-oauth/client/CustomOAuth");
const client_1 = require("../../settings/client");
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
const Tokenpass = new CustomOAuth_1.CustomOAuth('tokenpass', config);
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        if (client_1.settings.get('API_Tokenpass_URL')) {
            config.serverURL = client_1.settings.get('API_Tokenpass_URL');
            Tokenpass.configure(config);
        }
    });
});
