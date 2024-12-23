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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOauthSettings = void 0;
const server_1 = require("../../app/settings/server");
const createOauthSettings = () => server_1.settingsRegistry.addGroup('OAuth', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.section('Drupal', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Drupal',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Drupal', false, { type: 'boolean' });
                yield this.add('API_Drupal_URL', '', {
                    type: 'string',
                    public: true,
                    enableQuery,
                    i18nDescription: 'API_Drupal_URL_Description',
                });
                yield this.add('Accounts_OAuth_Drupal_id', '', { type: 'string', enableQuery });
                yield this.add('Accounts_OAuth_Drupal_secret', '', { type: 'string', enableQuery, secret: true });
                yield this.add('Accounts_OAuth_Drupal_callback_url', '_oauth/drupal', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        yield this.section('Apple', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Accounts_OAuth_Apple', false, { type: 'boolean', public: true });
                yield this.add('Accounts_OAuth_Apple_id', '', { type: 'string', public: true });
                yield this.add('Accounts_OAuth_Apple_secretKey', '', { type: 'string', multiline: true });
                yield this.add('Accounts_OAuth_Apple_iss', '', { type: 'string' });
                yield this.add('Accounts_OAuth_Apple_kid', '', { type: 'string' });
            });
        });
        yield this.section('GitHub Enterprise', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_GitHub_Enterprise',
                    value: true,
                };
                yield this.add('Accounts_OAuth_GitHub_Enterprise', false, { type: 'boolean' });
                yield this.add('API_GitHub_Enterprise_URL', '', {
                    type: 'string',
                    public: true,
                    enableQuery,
                    i18nDescription: 'API_GitHub_Enterprise_URL_Description',
                });
                yield this.add('Accounts_OAuth_GitHub_Enterprise_id', '', {
                    type: 'string',
                    enableQuery,
                    secret: true,
                });
                yield this.add('Accounts_OAuth_GitHub_Enterprise_secret', '', {
                    type: 'string',
                    enableQuery,
                    secret: true,
                });
                yield this.add('Accounts_OAuth_GitHub_Enterprise_callback_url', '_oauth/github_enterprise', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        yield this.section('GitLab', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Gitlab',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Gitlab', false, { type: 'boolean', public: true });
                yield this.add('API_Gitlab_URL', '', { type: 'string', enableQuery, public: true, secret: true });
                yield this.add('Accounts_OAuth_Gitlab_id', '', { type: 'string', enableQuery });
                yield this.add('Accounts_OAuth_Gitlab_secret', '', { type: 'string', enableQuery, secret: true });
                yield this.add('Accounts_OAuth_Gitlab_identity_path', '/api/v4/user', {
                    type: 'string',
                    public: true,
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Gitlab_merge_users', false, {
                    type: 'boolean',
                    public: true,
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Gitlab_callback_url', '_oauth/gitlab', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        yield this.section('Nextcloud', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Nextcloud',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Nextcloud', false, { type: 'boolean', public: true });
                yield this.add('Accounts_OAuth_Nextcloud_URL', '', { type: 'string', enableQuery, public: true });
                yield this.add('Accounts_OAuth_Nextcloud_id', '', { type: 'string', enableQuery });
                yield this.add('Accounts_OAuth_Nextcloud_secret', '', { type: 'string', enableQuery });
                yield this.add('Accounts_OAuth_Nextcloud_callback_url', '_oauth/nextcloud', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Nextcloud_button_label_text', 'Nextcloud', {
                    type: 'string',
                    public: true,
                    i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Text',
                    persistent: true,
                });
                yield this.add('Accounts_OAuth_Nextcloud_button_label_color', '#ffffff', {
                    type: 'string',
                    public: true,
                    i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Color',
                    persistent: true,
                    alert: 'OAuth_button_colors_alert',
                });
                yield this.add('Accounts_OAuth_Nextcloud_button_color', '#0082c9', {
                    type: 'string',
                    public: true,
                    i18nLabel: 'Accounts_OAuth_Custom_Button_Color',
                    persistent: true,
                    alert: 'OAuth_button_colors_alert',
                });
            });
        });
        yield this.section('Tokenpass', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Tokenpass',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Tokenpass', false, { type: 'boolean' });
                yield this.add('API_Tokenpass_URL', '', {
                    type: 'string',
                    public: true,
                    enableQuery,
                    i18nDescription: 'API_Tokenpass_URL_Description',
                });
                yield this.add('Accounts_OAuth_Tokenpass_id', '', { type: 'string', enableQuery });
                yield this.add('Accounts_OAuth_Tokenpass_secret', '', { type: 'string', enableQuery });
                yield this.add('Accounts_OAuth_Tokenpass_callback_url', '_oauth/tokenpass', {
                    type: 'relativeUrl',
                    readonly: true,
                    // @ts-expect-error - force: true is not a valid option for this method
                    force: true,
                    enableQuery,
                });
            });
        });
        yield this.section('WordPress', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Wordpress',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Wordpress', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('API_Wordpress_URL', '', {
                    type: 'string',
                    enableQuery,
                    public: true,
                    secret: true,
                });
                yield this.add('Accounts_OAuth_Wordpress_id', '', {
                    type: 'string',
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Wordpress_secret', '', {
                    type: 'string',
                    enableQuery,
                    secret: true,
                });
                yield this.add('Accounts_OAuth_Wordpress_server_type', '', {
                    type: 'select',
                    enableQuery,
                    public: true,
                    values: [
                        {
                            key: 'wordpress-com',
                            i18nLabel: 'Accounts_OAuth_Wordpress_server_type_wordpress_com',
                        },
                        {
                            key: 'wp-oauth-server',
                            i18nLabel: 'Accounts_OAuth_Wordpress_server_type_wp_oauth_server',
                        },
                        {
                            key: 'custom',
                            i18nLabel: 'Accounts_OAuth_Wordpress_server_type_custom',
                        },
                    ],
                    i18nLabel: 'Server_Type',
                });
                const customOAuthQuery = [
                    {
                        _id: 'Accounts_OAuth_Wordpress',
                        value: true,
                    },
                    {
                        _id: 'Accounts_OAuth_Wordpress_server_type',
                        value: 'custom',
                    },
                ];
                yield this.add('Accounts_OAuth_Wordpress_identity_path', '', {
                    type: 'string',
                    enableQuery: customOAuthQuery,
                    public: true,
                });
                yield this.add('Accounts_OAuth_Wordpress_identity_token_sent_via', '', {
                    type: 'string',
                    enableQuery: customOAuthQuery,
                    public: true,
                });
                yield this.add('Accounts_OAuth_Wordpress_token_path', '', {
                    type: 'string',
                    enableQuery: customOAuthQuery,
                    public: true,
                });
                yield this.add('Accounts_OAuth_Wordpress_authorize_path', '', {
                    type: 'string',
                    enableQuery: customOAuthQuery,
                    public: true,
                });
                yield this.add('Accounts_OAuth_Wordpress_scope', '', {
                    type: 'string',
                    enableQuery: customOAuthQuery,
                    public: true,
                });
                yield this.add('Accounts_OAuth_Wordpress_callback_url', '_oauth/wordpress', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        yield this.section('Dolphin', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Accounts_OAuth_Dolphin_URL', '', {
                    type: 'string',
                    public: true,
                    i18nLabel: 'URL',
                });
                yield this.add('Accounts_OAuth_Dolphin', false, {
                    type: 'boolean',
                    i18nLabel: 'Accounts_OAuth_Custom_Enable',
                });
                yield this.add('Accounts_OAuth_Dolphin_id', '', {
                    type: 'string',
                    i18nLabel: 'Accounts_OAuth_Custom_id',
                });
                yield this.add('Accounts_OAuth_Dolphin_secret', '', {
                    type: 'string',
                    i18nLabel: 'Accounts_OAuth_Custom_Secret',
                    secret: true,
                });
                yield this.add('Accounts_OAuth_Dolphin_login_style', 'redirect', {
                    type: 'select',
                    i18nLabel: 'Accounts_OAuth_Custom_Login_Style',
                    persistent: true,
                    values: [
                        { key: 'redirect', i18nLabel: 'Redirect' },
                        { key: 'popup', i18nLabel: 'Popup' },
                        { key: '', i18nLabel: 'Default' },
                    ],
                });
                yield this.add('Accounts_OAuth_Dolphin_button_label_text', '', {
                    type: 'string',
                    i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Text',
                    persistent: true,
                });
                yield this.add('Accounts_OAuth_Dolphin_button_label_color', '#FFFFFF', {
                    type: 'string',
                    i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Color',
                    persistent: true,
                    alert: 'OAuth_button_colors_alert',
                });
                yield this.add('Accounts_OAuth_Dolphin_button_color', '#1d74f5', {
                    type: 'string',
                    i18nLabel: 'Accounts_OAuth_Custom_Button_Color',
                    persistent: true,
                    alert: 'OAuth_button_colors_alert',
                });
            });
        });
        yield this.section('Facebook', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Facebook',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Facebook', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Accounts_OAuth_Facebook_id', '', {
                    type: 'string',
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Facebook_secret', '', {
                    type: 'string',
                    enableQuery,
                    secret: true,
                });
                return this.add('Accounts_OAuth_Facebook_callback_url', '_oauth/facebook', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        yield this.section('Google', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Google',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Google', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Accounts_OAuth_Google_id', '', {
                    type: 'string',
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Google_secret', '', {
                    type: 'string',
                    enableQuery,
                    secret: true,
                });
                return this.add('Accounts_OAuth_Google_callback_url', '_oauth/google', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        yield this.section('GitHub', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Github',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Github', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Accounts_OAuth_Github_id', '', {
                    type: 'string',
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Github_secret', '', {
                    type: 'string',
                    enableQuery,
                    secret: true,
                });
                return this.add('Accounts_OAuth_Github_callback_url', '_oauth/github', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        yield this.section('Linkedin', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Linkedin',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Linkedin', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Accounts_OAuth_Linkedin_id', '', {
                    type: 'string',
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Linkedin_secret', '', {
                    type: 'string',
                    enableQuery,
                    secret: true,
                });
                return this.add('Accounts_OAuth_Linkedin_callback_url', '_oauth/linkedin', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        yield this.section('Meteor', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Meteor',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Meteor', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Accounts_OAuth_Meteor_id', '', {
                    type: 'string',
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Meteor_secret', '', {
                    type: 'string',
                    enableQuery,
                    secret: true,
                });
                return this.add('Accounts_OAuth_Meteor_callback_url', '_oauth/meteor', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        yield this.section('Twitter', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Accounts_OAuth_Twitter',
                    value: true,
                };
                yield this.add('Accounts_OAuth_Twitter', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Accounts_OAuth_Twitter_id', '', {
                    type: 'string',
                    enableQuery,
                });
                yield this.add('Accounts_OAuth_Twitter_secret', '', {
                    type: 'string',
                    enableQuery,
                    secret: true,
                });
                return this.add('Accounts_OAuth_Twitter_callback_url', '_oauth/twitter', {
                    type: 'relativeUrl',
                    readonly: true,
                    enableQuery,
                });
            });
        });
        return this.section('Proxy', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Accounts_OAuth_Proxy_host', 'https://oauth-proxy.rocket.chat', {
                    type: 'string',
                    public: true,
                });
                return this.add('Accounts_OAuth_Proxy_services', '', {
                    type: 'string',
                    public: true,
                });
            });
        });
    });
});
exports.createOauthSettings = createOauthSettings;
