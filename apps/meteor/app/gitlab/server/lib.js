"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const custom_oauth_server_1 = require("../../custom-oauth/server/custom_oauth_server");
const server_1 = require("../../settings/server");
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
const Gitlab = new custom_oauth_server_1.CustomOAuth('gitlab', config);
meteor_1.Meteor.startup(() => {
    const updateConfig = underscore_1.default.debounce(() => {
        config.serverURL = server_1.settings.get('API_Gitlab_URL').trim().replace(/\/*$/, '') || config.serverURL;
        config.identityPath = server_1.settings.get('Accounts_OAuth_Gitlab_identity_path') || config.identityPath;
        config.mergeUsers = Boolean(server_1.settings.get('Accounts_OAuth_Gitlab_merge_users'));
        Gitlab.configure(config);
    }, 300);
    server_1.settings.watchMultiple(['API_Gitlab_URL', 'Accounts_OAuth_Gitlab_identity_path', 'Accounts_OAuth_Gitlab_merge_users'], updateConfig);
});
