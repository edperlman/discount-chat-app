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
exports.createPushSettings = void 0;
const server_1 = require("../../app/settings/server");
const pushEnabledWithoutGateway = [
    {
        _id: 'Push_enable',
        value: true,
    },
    {
        _id: 'Push_enable_gateway',
        value: false,
    },
];
const createPushSettings = () => server_1.settingsRegistry.addGroup('Push', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('Push_enable', true, {
            type: 'boolean',
            public: true,
            alert: 'Push_Setting_Requires_Restart_Alert',
        });
        yield this.add('Push_UseLegacy', false, {
            type: 'boolean',
            alert: 'Push_Setting_Legacy_Warning',
        });
        yield this.add('Push_enable_gateway', true, {
            type: 'boolean',
            alert: 'Push_Setting_Requires_Restart_Alert',
            enableQuery: [
                {
                    _id: 'Push_enable',
                    value: true,
                },
                {
                    _id: 'Register_Server',
                    value: true,
                },
                {
                    _id: 'Cloud_Service_Agree_PrivacyTerms',
                    value: true,
                },
            ],
        });
        yield this.add('Push_gateway', 'https://gateway.rocket.chat', {
            type: 'string',
            i18nDescription: 'Push_gateway_description',
            alert: 'Push_Setting_Requires_Restart_Alert',
            multiline: true,
            enableQuery: [
                {
                    _id: 'Push_enable',
                    value: true,
                },
                {
                    _id: 'Push_enable_gateway',
                    value: true,
                },
            ],
        });
        yield this.add('Push_production', true, {
            type: 'boolean',
            public: true,
            alert: 'Push_Setting_Requires_Restart_Alert',
            enableQuery: pushEnabledWithoutGateway,
        });
        yield this.add('Push_test_push', 'push_test', {
            type: 'action',
            actionText: 'Send_a_test_push_to_my_user',
            enableQuery: {
                _id: 'Push_enable',
                value: true,
            },
        });
        yield this.section('Certificates_and_Keys', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Push_apn_passphrase', '', {
                    type: 'string',
                    enableQuery: [],
                    secret: true,
                });
                yield this.add('Push_apn_key', '', {
                    type: 'string',
                    multiline: true,
                    enableQuery: [],
                    secret: true,
                });
                yield this.add('Push_apn_cert', '', {
                    type: 'string',
                    multiline: true,
                    enableQuery: [],
                    secret: true,
                });
                yield this.add('Push_apn_dev_passphrase', '', {
                    type: 'string',
                    enableQuery: [],
                    secret: true,
                });
                yield this.add('Push_apn_dev_key', '', {
                    type: 'string',
                    multiline: true,
                    enableQuery: [],
                    secret: true,
                });
                yield this.add('Push_apn_dev_cert', '', {
                    type: 'string',
                    multiline: true,
                    enableQuery: [],
                    secret: true,
                });
                yield this.add('Push_gcm_api_key', '', {
                    type: 'string',
                    enableQuery: [
                        {
                            _id: 'Push_UseLegacy',
                            value: true,
                        },
                    ],
                    secret: true,
                });
                yield this.add('Push_google_api_credentials', '', {
                    type: 'code',
                    multiline: true,
                    enableQuery: [
                        {
                            _id: 'Push_UseLegacy',
                            value: false,
                        },
                    ],
                    secret: true,
                });
                return this.add('Push_gcm_project_number', '', {
                    type: 'string',
                    public: true,
                    enableQuery: [
                        {
                            _id: 'Push_UseLegacy',
                            value: true,
                        },
                    ],
                    secret: true,
                });
            });
        });
        return this.section('Privacy', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Push_show_username_room', true, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Push_show_message', true, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Push_request_content_from_server', true, {
                    type: 'boolean',
                    enterprise: true,
                    invalidValue: false,
                    modules: ['push-privacy'],
                });
            });
        });
    });
});
exports.createPushSettings = createPushSettings;
