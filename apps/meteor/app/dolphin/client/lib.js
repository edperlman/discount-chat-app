"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const CustomOAuth_1 = require("../../custom-oauth/client/CustomOAuth");
const client_1 = require("../../settings/client");
const config = {
    serverURL: '',
    authorizePath: '/m/oauth2/auth/',
    tokenPath: '/m/oauth2/token/',
    identityPath: '/m/oauth2/api/me/',
    scope: 'basic',
    addAutopublishFields: {
        forLoggedInUser: ['services.dolphin'],
        forOtherUsers: ['services.dolphin.name'],
    },
    accessTokenParam: 'access_token',
};
const Dolphin = new CustomOAuth_1.CustomOAuth('dolphin', config);
meteor_1.Meteor.startup(() => tracker_1.Tracker.autorun(() => {
    if (client_1.settings.get('Accounts_OAuth_Dolphin_URL')) {
        config.serverURL = client_1.settings.get('Accounts_OAuth_Dolphin_URL');
        return Dolphin.configure(config);
    }
}));
