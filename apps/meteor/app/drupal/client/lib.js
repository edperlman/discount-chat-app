"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const CustomOAuth_1 = require("../../custom-oauth/client/CustomOAuth");
const client_1 = require("../../settings/client");
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
const Drupal = new CustomOAuth_1.CustomOAuth('drupal', config);
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        if (client_1.settings.get('API_Drupal_URL')) {
            config.serverURL = client_1.settings.get('API_Drupal_URL');
            Drupal.configure(config);
        }
    });
});
