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
    serverURL: '',
    tokenPath: '/index.php/apps/oauth2/api/v1/token',
    tokenSentVia: 'header',
    authorizePath: '/index.php/apps/oauth2/authorize',
    identityPath: '/ocs/v2.php/cloud/user?format=json',
    scope: 'openid',
    addAutopublishFields: {
        forLoggedInUser: ['services.nextcloud'],
        forOtherUsers: ['services.nextcloud.name'],
    },
};
const Nextcloud = new custom_oauth_server_1.CustomOAuth('nextcloud', config);
const fillServerURL = underscore_1.default.debounce(() => {
    const nextcloudURL = server_1.settings.get('Accounts_OAuth_Nextcloud_URL');
    if (!nextcloudURL) {
        if (nextcloudURL === undefined) {
            return fillServerURL();
        }
        return;
    }
    config.serverURL = nextcloudURL.trim().replace(/\/*$/, '');
    return Nextcloud.configure(config);
}, 1000);
meteor_1.Meteor.startup(() => {
    server_1.settings.watch('Accounts_OAuth_Nextcloud_URL', () => fillServerURL());
});
