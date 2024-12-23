"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    identityPath: '/oauth/me',
    addAutopublishFields: {
        forLoggedInUser: ['services.wordpress'],
        forOtherUsers: ['services.wordpress.user_login'],
    },
    accessTokenParam: 'access_token',
};
const WordPress = new CustomOAuth_1.CustomOAuth('wordpress', config);
const fillSettings = underscore_1.default.debounce(() => __awaiter(void 0, void 0, void 0, function* () {
    config.serverURL = client_1.settings.get('API_Wordpress_URL');
    if (!config.serverURL) {
        if (config.serverURL === undefined) {
            return fillSettings();
        }
        return;
    }
    delete config.identityPath;
    delete config.identityTokenSentVia;
    delete config.authorizePath;
    delete config.tokenPath;
    delete config.scope;
    const serverType = client_1.settings.get('Accounts_OAuth_Wordpress_server_type');
    switch (serverType) {
        case 'custom':
            if (client_1.settings.get('Accounts_OAuth_Wordpress_identity_path')) {
                config.identityPath = client_1.settings.get('Accounts_OAuth_Wordpress_identity_path');
            }
            if (client_1.settings.get('Accounts_OAuth_Wordpress_identity_token_sent_via')) {
                config.identityTokenSentVia = client_1.settings.get('Accounts_OAuth_Wordpress_identity_token_sent_via');
            }
            if (client_1.settings.get('Accounts_OAuth_Wordpress_token_path')) {
                config.tokenPath = client_1.settings.get('Accounts_OAuth_Wordpress_token_path');
            }
            if (client_1.settings.get('Accounts_OAuth_Wordpress_authorize_path')) {
                config.authorizePath = client_1.settings.get('Accounts_OAuth_Wordpress_authorize_path');
            }
            if (client_1.settings.get('Accounts_OAuth_Wordpress_scope')) {
                config.scope = client_1.settings.get('Accounts_OAuth_Wordpress_scope');
            }
            break;
        case 'wordpress-com':
            config.identityPath = 'https://public-api.wordpress.com/rest/v1/me';
            config.identityTokenSentVia = 'header';
            config.authorizePath = 'https://public-api.wordpress.com/oauth2/authorize';
            config.tokenPath = 'https://public-api.wordpress.com/oauth2/token';
            config.scope = 'auth';
            break;
        default:
            config.identityPath = '/oauth/me';
            break;
    }
    const result = WordPress.configure(config);
    return result;
}), 100);
meteor_1.Meteor.startup(() => {
    return tracker_1.Tracker.autorun(() => {
        return fillSettings();
    });
});
