"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const custom_oauth_server_1 = require("../../custom-oauth/server/custom_oauth_server");
const server_1 = require("../../settings/server");
// Drupal Server CallBack URL needs to be http(s)://{rocketchat.server}[:port]/_oauth/drupal
// In RocketChat -> Administration the URL needs to be http(s)://{drupal.server}/
const config = {
    serverURL: '',
    identityPath: '/oauth2/UserInfo',
    authorizePath: '/oauth2/authorize',
    tokenPath: '/oauth2/token',
    scope: 'openid email profile offline_access',
    tokenSentVia: 'payload',
    usernameField: 'preferred_username',
    mergeUsers: true,
    addAutopublishFields: {
        forLoggedInUser: ['services.drupal'],
        forOtherUsers: ['services.drupal.name'],
    },
    accessTokenParam: 'access_token',
};
const Drupal = new custom_oauth_server_1.CustomOAuth('drupal', config);
meteor_1.Meteor.startup(() => {
    server_1.settings.watch('API_Drupal_URL', (value) => {
        config.serverURL = value;
        Drupal.configure(config);
    });
});
