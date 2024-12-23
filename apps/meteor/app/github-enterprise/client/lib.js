"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const CustomOAuth_1 = require("../../custom-oauth/client/CustomOAuth");
const client_1 = require("../../settings/client");
// GitHub Enterprise Server CallBack URL needs to be http(s)://{rocketchat.server}[:port]/_oauth/github_enterprise
// In RocketChat -> Administration the URL needs to be http(s)://{github.enterprise.server}/
const config = {
    serverURL: '',
    identityPath: '/api/v3/user',
    authorizePath: '/login/oauth/authorize',
    tokenPath: '/login/oauth/access_token',
    addAutopublishFields: {
        forLoggedInUser: ['services.github-enterprise'],
        forOtherUsers: ['services.github-enterprise.username'],
    },
};
const GitHubEnterprise = new CustomOAuth_1.CustomOAuth('github_enterprise', config);
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        if (client_1.settings.get('API_GitHub_Enterprise_URL')) {
            config.serverURL = client_1.settings.get('API_GitHub_Enterprise_URL');
            GitHubEnterprise.configure(config);
        }
    });
});
