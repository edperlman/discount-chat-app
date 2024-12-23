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
const service_configuration_1 = require("meteor/service-configuration");
const underscore_1 = __importDefault(require("underscore"));
const custom_oauth_server_1 = require("../../custom-oauth/server/custom_oauth_server");
const server_1 = require("../../settings/server");
const config = {
    serverURL: '',
    identityPath: '/oauth/me',
    addAutopublishFields: {
        forLoggedInUser: ['services.wordpress'],
        forOtherUsers: ['services.wordpress.user_login'],
    },
    accessTokenParam: 'access_token',
};
const WordPress = new custom_oauth_server_1.CustomOAuth('wordpress', config);
const fillSettings = underscore_1.default.debounce(() => __awaiter(void 0, void 0, void 0, function* () {
    config.serverURL = server_1.settings.get('API_Wordpress_URL');
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
    const serverType = server_1.settings.get('Accounts_OAuth_Wordpress_server_type');
    switch (serverType) {
        case 'custom':
            if (server_1.settings.get('Accounts_OAuth_Wordpress_identity_path')) {
                config.identityPath = server_1.settings.get('Accounts_OAuth_Wordpress_identity_path');
            }
            if (server_1.settings.get('Accounts_OAuth_Wordpress_identity_token_sent_via')) {
                config.identityTokenSentVia = server_1.settings.get('Accounts_OAuth_Wordpress_identity_token_sent_via');
            }
            if (server_1.settings.get('Accounts_OAuth_Wordpress_token_path')) {
                config.tokenPath = server_1.settings.get('Accounts_OAuth_Wordpress_token_path');
            }
            if (server_1.settings.get('Accounts_OAuth_Wordpress_authorize_path')) {
                config.authorizePath = server_1.settings.get('Accounts_OAuth_Wordpress_authorize_path');
            }
            if (server_1.settings.get('Accounts_OAuth_Wordpress_scope')) {
                config.scope = server_1.settings.get('Accounts_OAuth_Wordpress_scope');
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
    const enabled = server_1.settings.get('Accounts_OAuth_Wordpress');
    if (enabled) {
        yield service_configuration_1.ServiceConfiguration.configurations.upsertAsync({
            service: 'wordpress',
        }, {
            $set: config,
        });
    }
    else {
        yield service_configuration_1.ServiceConfiguration.configurations.removeAsync({
            service: 'wordpress',
        });
    }
    return result;
}), 1000);
meteor_1.Meteor.startup(() => {
    return server_1.settings.watchByRegex(/(API\_Wordpress\_URL)?(Accounts\_OAuth\_Wordpress\_)?/, () => fillSettings());
});
