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
exports.createCallCenterSettings = void 0;
const server_1 = require("../../app/settings/server");
const createCallCenterSettings = () => server_1.settingsRegistry.addGroup('VoIP_Omnichannel', function () {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Check with the backend team if an i18nPlaceholder is possible
        yield this.with({ tab: 'Settings' }, function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('General_Settings', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('VoIP_Enabled', false, {
                            type: 'boolean',
                            public: true,
                            i18nDescription: 'VoIP_Enabled_Description',
                            enableQuery: {
                                _id: 'Livechat_enabled',
                                value: true,
                            },
                        });
                        yield this.add('VoIP_JWT_Secret', '', {
                            type: 'password',
                            i18nDescription: 'VoIP_JWT_Secret_description',
                            enableQuery: {
                                _id: 'VoIP_Enabled',
                                value: true,
                            },
                        });
                    });
                });
                yield this.section('Voip_Server_Configuration', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('VoIP_Server_Name', '', {
                            type: 'string',
                            public: true,
                            placeholder: 'WebSocket Server',
                            enableQuery: {
                                _id: 'VoIP_Enabled',
                                value: true,
                            },
                        });
                        yield this.add('VoIP_Server_Websocket_Path', '', {
                            type: 'string',
                            public: true,
                            placeholder: 'wss://your.domain.name',
                            enableQuery: {
                                _id: 'VoIP_Enabled',
                                value: true,
                            },
                        });
                        yield this.add('VoIP_Retry_Count', -1, {
                            type: 'int',
                            public: true,
                            i18nDescription: 'VoIP_Retry_Count_Description',
                            placeholder: '1',
                            enableQuery: {
                                _id: 'VoIP_Enabled',
                                value: true,
                            },
                        });
                        yield this.add('VoIP_Enable_Keep_Alive_For_Unstable_Networks', true, {
                            type: 'boolean',
                            public: true,
                            i18nDescription: 'VoIP_Enable_Keep_Alive_For_Unstable_Networks_Description',
                            enableQuery: {
                                _id: 'Livechat_enabled',
                                value: true,
                            },
                        });
                    });
                });
                yield this.section('Management_Server', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('VoIP_Management_Server_Host', '', {
                            type: 'string',
                            public: true,
                            placeholder: 'https://your.domain.name',
                            enableQuery: {
                                _id: 'VoIP_Enabled',
                                value: true,
                            },
                        });
                        yield this.add('VoIP_Management_Server_Port', 0, {
                            type: 'int',
                            public: true,
                            placeholder: '8080',
                            enableQuery: {
                                _id: 'VoIP_Enabled',
                                value: true,
                            },
                        });
                        yield this.add('VoIP_Management_Server_Name', '', {
                            type: 'string',
                            public: true,
                            placeholder: 'Server Name',
                            enableQuery: {
                                _id: 'VoIP_Enabled',
                                value: true,
                            },
                        });
                        yield this.add('VoIP_Management_Server_Username', '', {
                            type: 'string',
                            public: true,
                            placeholder: 'Username',
                            enableQuery: {
                                _id: 'VoIP_Enabled',
                                value: true,
                            },
                        });
                        yield this.add('VoIP_Management_Server_Password', '', {
                            type: 'password',
                            public: true,
                            enableQuery: {
                                _id: 'VoIP_Enabled',
                                value: true,
                            },
                        });
                    });
                });
            });
        });
    });
});
exports.createCallCenterSettings = createCallCenterSettings;
