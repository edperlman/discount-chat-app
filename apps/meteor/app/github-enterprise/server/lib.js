"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const custom_oauth_server_1 = require("../../custom-oauth/server/custom_oauth_server");
const server_1 = require("../../settings/server");
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
const GitHubEnterprise = new custom_oauth_server_1.CustomOAuth('github_enterprise', config);
meteor_1.Meteor.startup(() => {
    server_1.settings.watch('API_GitHub_Enterprise_URL', (value) => {
        config.serverURL = value;
        GitHubEnterprise.configure(config);
    });
});
