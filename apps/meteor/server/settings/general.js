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
exports.createGeneralSettings = void 0;
const server_1 = require("../../app/settings/server");
const createGeneralSettings = () => server_1.settingsRegistry.addGroup('General', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.section('REST API', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('API_Upper_Count_Limit', 100, { type: 'int', public: false });
                yield this.add('API_Default_Count', 50, { type: 'int', public: false });
                yield this.add('API_Allow_Infinite_Count', true, { type: 'boolean', public: false });
                yield this.add('API_Enable_Direct_Message_History_EndPoint', false, {
                    type: 'boolean',
                    public: false,
                });
                yield this.add('API_Enable_Shields', true, { type: 'boolean', public: false });
                yield this.add('API_Shield_Types', '*', {
                    type: 'string',
                    public: false,
                    enableQuery: { _id: 'API_Enable_Shields', value: true },
                });
                yield this.add('API_Shield_user_require_auth', false, {
                    type: 'boolean',
                    public: false,
                    enableQuery: { _id: 'API_Enable_Shields', value: true },
                });
                yield this.add('API_Enable_CORS', false, { type: 'boolean', public: false });
                yield this.add('API_CORS_Origin', '*', {
                    type: 'string',
                    public: false,
                    enableQuery: { _id: 'API_Enable_CORS', value: true },
                });
                yield this.add('API_Use_REST_For_DDP_Calls', true, {
                    type: 'boolean',
                    public: true,
                });
                // Should enforce the permission on next Major and remove this setting
                yield this.add('API_Apply_permission_view-outside-room_on_users-list', false, {
                    type: 'boolean',
                    public: true,
                    alert: 'This_is_a_deprecated_feature_alert',
                });
            });
        });
        yield this.add('Show_Setup_Wizard', 'pending', {
            type: 'select',
            public: true,
            readonly: true,
            values: [
                {
                    key: 'pending',
                    i18nLabel: 'Pending',
                },
                {
                    key: 'in_progress',
                    i18nLabel: 'In_progress',
                },
                {
                    key: 'completed',
                    i18nLabel: 'Completed',
                },
            ],
        });
        yield this.add('Site_Url', typeof global.__meteor_runtime_config__ !== 'undefined' && global.__meteor_runtime_config__ !== null
            ? global.__meteor_runtime_config__.ROOT_URL
            : null, {
            type: 'string',
            i18nDescription: 'Site_Url_Description',
            public: true,
        });
        yield this.add('Site_Name', 'Rocket.Chat', {
            type: 'string',
            public: true,
            wizard: {
                step: 3,
                order: 0,
            },
        });
        yield this.add('Document_Domain', '', {
            type: 'string',
            public: true,
        });
        yield this.add('Language', '', {
            type: 'language',
            public: true,
            wizard: {
                step: 3,
                order: 1,
            },
            alert: 'Language_setting_warning',
        });
        yield this.add('Allow_Invalid_SelfSigned_Certs', false, {
            type: 'boolean',
            secret: true,
        });
        yield this.add('Enable_CSP', true, {
            type: 'boolean',
        });
        yield this.add('Extra_CSP_Domains', '', {
            type: 'string',
            multiline: true,
        });
        yield this.add('Iframe_Restrict_Access', true, {
            type: 'boolean',
            secret: true,
        });
        yield this.add('Iframe_X_Frame_Options', 'sameorigin', {
            type: 'string',
            secret: true,
            enableQuery: {
                _id: 'Iframe_Restrict_Access',
                value: true,
            },
        });
        yield this.add('Favorite_Rooms', true, {
            type: 'boolean',
            public: true,
        });
        yield this.add('First_Channel_After_Login', '', {
            type: 'string',
            public: true,
        });
        yield this.add('Unread_Count', 'user_and_group_mentions_only', {
            type: 'select',
            values: [
                {
                    key: 'all_messages',
                    i18nLabel: 'All_messages',
                },
                {
                    key: 'user_mentions_only',
                    i18nLabel: 'User_mentions_only',
                },
                {
                    key: 'group_mentions_only',
                    i18nLabel: 'Group_mentions_only',
                },
                {
                    key: 'user_and_group_mentions_only',
                    i18nLabel: 'User_and_group_mentions_only',
                },
            ],
            public: true,
        });
        yield this.add('Unread_Count_DM', 'all_messages', {
            type: 'select',
            values: [
                {
                    key: 'all_messages',
                    i18nLabel: 'All_messages',
                },
                {
                    key: 'mentions_only',
                    i18nLabel: 'Mentions_only',
                },
            ],
            public: true,
        });
        yield this.add('Unread_Count_Omni', 'all_messages', {
            type: 'select',
            values: [
                {
                    key: 'all_messages',
                    i18nLabel: 'All_messages',
                },
                {
                    key: 'mentions_only',
                    i18nLabel: 'Mentions_only',
                },
            ],
            public: true,
        });
        yield this.add('DeepLink_Url', 'https://go.rocket.chat', {
            type: 'string',
            public: true,
        });
        yield this.add('CDN_PREFIX', '', {
            type: 'string',
            public: true,
        });
        yield this.add('CDN_PREFIX_ALL', true, {
            type: 'boolean',
            public: true,
        });
        yield this.add('CDN_JSCSS_PREFIX', '', {
            type: 'string',
            public: true,
            enableQuery: {
                _id: 'CDN_PREFIX_ALL',
                value: false,
            },
        });
        yield this.add('Force_SSL', false, {
            type: 'boolean',
            public: true,
        });
        yield this.add('GoogleTagManager_id', '', {
            type: 'string',
            public: true,
            secret: true,
        });
        yield this.add('Bugsnag_api_key', '', {
            type: 'string',
            public: false,
            secret: true,
        });
        yield this.add('Restart', 'restart_server', {
            type: 'action',
            actionText: 'Restart_the_server',
        });
        yield this.add('Store_Last_Message', true, {
            type: 'boolean',
            public: true,
            i18nDescription: 'Store_Last_Message_Sent_per_Room',
        });
        yield this.add('Robot_Instructions_File_Content', 'User-agent: *\nDisallow: /', {
            type: 'string',
            public: true,
            multiline: true,
        });
        yield this.add('Default_Referrer_Policy', 'same-origin', {
            type: 'select',
            values: [
                {
                    key: 'no-referrer',
                    i18nLabel: 'No_Referrer',
                },
                {
                    key: 'no-referrer-when-downgrade',
                    i18nLabel: 'No_Referrer_When_Downgrade',
                },
                {
                    key: 'origin',
                    i18nLabel: 'Origin',
                },
                {
                    key: 'origin-when-cross-origin',
                    i18nLabel: 'Origin_When_Cross_Origin',
                },
                {
                    key: 'same-origin',
                    i18nLabel: 'Same_Origin',
                },
                {
                    key: 'strict-origin',
                    i18nLabel: 'Strict_Origin',
                },
                {
                    key: 'strict-origin-when-cross-origin',
                    i18nLabel: 'Strict_Origin_When_Cross_Origin',
                },
                {
                    key: 'unsafe-url',
                    i18nLabel: 'Unsafe_Url',
                },
            ],
            public: true,
        });
        yield this.add('ECDH_Enabled', false, {
            type: 'boolean',
            alert: 'This_feature_is_currently_in_alpha',
        });
        yield this.section('UTF8', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('UTF8_User_Names_Validation', '[0-9a-zA-Z-_.]+', {
                    type: 'string',
                    public: true,
                    i18nDescription: 'UTF8_User_Names_Validation_Description',
                });
                yield this.add('UTF8_Channel_Names_Validation', '[0-9a-zA-Z-_.]+', {
                    type: 'string',
                    public: true,
                    i18nDescription: 'UTF8_Channel_Names_Validation_Description',
                });
                return this.add('UTF8_Names_Slugify', true, {
                    type: 'boolean',
                    public: true,
                });
            });
        });
        yield this.section('Reporting', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return this.add('Statistics_reporting', true, {
                    type: 'boolean',
                    hidden: true,
                });
            });
        });
        yield this.section('Notifications', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Notifications_Max_Room_Members', 100, {
                    type: 'int',
                    public: true,
                    i18nDescription: 'Notifications_Max_Room_Members_Description',
                });
            });
        });
        yield this.section('REST API', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return this.add('API_User_Limit', 500, {
                    type: 'int',
                    public: true,
                    i18nDescription: 'API_User_Limit',
                });
            });
        });
        yield this.section('Iframe_Integration', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Iframe_Integration_send_enable', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Iframe_Integration_send_target_origin', '*', {
                    type: 'string',
                    public: true,
                    enableQuery: {
                        _id: 'Iframe_Integration_send_enable',
                        value: true,
                    },
                });
                yield this.add('Iframe_Integration_receive_enable', false, {
                    type: 'boolean',
                    public: true,
                });
                return this.add('Iframe_Integration_receive_origin', '*', {
                    type: 'string',
                    public: true,
                    enableQuery: {
                        _id: 'Iframe_Integration_receive_enable',
                        value: true,
                    },
                });
            });
        });
        yield this.section('Translations', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return this.add('Custom_Translations', '', {
                    type: 'code',
                    code: 'application/json',
                    public: true,
                });
            });
        });
        yield this.section('Stream_Cast', function () {
            return __awaiter(this, void 0, void 0, function* () {
                return this.add('Stream_Cast_Address', '', {
                    type: 'string',
                });
            });
        });
        yield this.section('NPS', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('NPS_survey_enabled', true, {
                    type: 'boolean',
                });
            });
        });
        yield this.section('Timezone', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Default_Timezone_For_Reporting', 'server', {
                    type: 'select',
                    values: [
                        {
                            key: 'server',
                            i18nLabel: 'Default_Server_Timezone',
                        },
                        {
                            key: 'custom',
                            i18nLabel: 'Default_Custom_Timezone',
                        },
                        {
                            key: 'user',
                            i18nLabel: 'Default_User_Timezone',
                        },
                    ],
                });
                yield this.add('Default_Custom_Timezone', '', {
                    type: 'timezone',
                    enableQuery: {
                        _id: 'Default_Timezone_For_Reporting',
                        value: 'custom',
                    },
                });
            });
        });
        yield this.section('Update', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Update_LatestAvailableVersion', '0.0.0', {
                    type: 'string',
                    readonly: true,
                });
                yield this.add('Update_EnableChecker', true, {
                    type: 'boolean',
                    enableQuery: {
                        _id: 'Register_Server',
                        value: true,
                    },
                    i18nDescription: 'Update_EnableChecker_Description',
                });
            });
        });
    });
});
exports.createGeneralSettings = createGeneralSettings;
