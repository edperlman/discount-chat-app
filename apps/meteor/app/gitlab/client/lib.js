"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const CustomOAuth_1 = require("../../custom-oauth/client/CustomOAuth");
const client_1 = require("../../settings/client");
const config = {
    serverURL: 'https://gitlab.com',
    identityPath: '/api/v4/user',
    scope: 'read_user',
    mergeUsers: false,
    addAutopublishFields: {
        forLoggedInUser: ['services.gitlab'],
        forOtherUsers: ['services.gitlab.username'],
    },
    accessTokenParam: 'access_token',
};
const Gitlab = new CustomOAuth_1.CustomOAuth('gitlab', config);
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        let anyChange = false;
        if (client_1.settings.get('API_Gitlab_URL')) {
            config.serverURL = client_1.settings.get('API_Gitlab_URL').trim().replace(/\/*$/, '');
            anyChange = true;
        }
        if (client_1.settings.get('Accounts_OAuth_Gitlab_identity_path')) {
            config.identityPath = client_1.settings.get('Accounts_OAuth_Gitlab_identity_path').trim() || config.identityPath;
            anyChange = true;
        }
        if (client_1.settings.get('Accounts_OAuth_Gitlab_merge_users')) {
            config.mergeUsers = true;
            anyChange = true;
        }
        if (anyChange) {
            Gitlab.configure(config);
        }
    });
});
