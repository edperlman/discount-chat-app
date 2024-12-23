"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const underscore_1 = __importDefault(require("underscore"));
const CustomOAuth_1 = require("../../custom-oauth/client/CustomOAuth");
const client_1 = require("../../settings/client");
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
const Nextcloud = new CustomOAuth_1.CustomOAuth('nextcloud', config);
const fillServerURL = underscore_1.default.debounce(() => {
    const nextcloudURL = client_1.settings.get('Accounts_OAuth_Nextcloud_URL');
    if (!nextcloudURL) {
        if (nextcloudURL === undefined) {
            return fillServerURL();
        }
        return;
    }
    config.serverURL = nextcloudURL.trim().replace(/\/*$/, '');
    return Nextcloud.configure(config);
}, 100);
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        return fillServerURL();
    });
});
