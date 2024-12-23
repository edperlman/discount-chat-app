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
exports.createSlackBridgeSettings = void 0;
const server_1 = require("../../app/settings/server");
const createSlackBridgeSettings = () => server_1.settingsRegistry.addGroup('SlackBridge', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('SlackBridge_Enabled', false, {
            type: 'boolean',
            i18nLabel: 'Enabled',
            public: true,
        });
        yield this.add('SlackBridge_UseLegacy', true, {
            type: 'boolean',
            enableQuery: {
                _id: 'SlackBridge_Enabled',
                value: true,
            },
            i18nLabel: 'SlackBridge_UseLegacy',
            i18nDescription: 'SlackBridge_UseLegacy_Description',
            public: true,
            packageValue: true,
        });
        yield this.add('SlackBridge_APIToken', '', {
            type: 'string',
            multiline: true,
            enableQuery: [
                {
                    _id: 'SlackBridge_UseLegacy',
                    value: true,
                },
                {
                    _id: 'SlackBridge_Enabled',
                    value: true,
                },
            ],
            i18nLabel: 'SlackBridge_APIToken',
            i18nDescription: 'SlackBridge_APIToken_Description',
            secret: true,
        });
        yield this.add('SlackBridge_BotToken', '', {
            type: 'string',
            multiline: true,
            enableQuery: [
                {
                    _id: 'SlackBridge_UseLegacy',
                    value: false,
                },
                {
                    _id: 'SlackBridge_Enabled',
                    value: true,
                },
            ],
            i18nLabel: 'SlackBridge_BotToken',
            i18nDescription: 'SlackBridge_BotToken_Description',
            secret: true,
        });
        yield this.add('SlackBridge_SigningSecret', '', {
            type: 'string',
            multiline: true,
            enableQuery: [
                {
                    _id: 'SlackBridge_UseLegacy',
                    value: false,
                },
                {
                    _id: 'SlackBridge_Enabled',
                    value: true,
                },
            ],
            i18nLabel: 'SlackBridge_SigningSecret',
            i18nDescription: 'SlackBridge_SigningSecret_Description',
            secret: true,
        });
        yield this.add('SlackBridge_AppToken', '', {
            type: 'string',
            multiline: true,
            enableQuery: [
                {
                    _id: 'SlackBridge_UseLegacy',
                    value: false,
                },
                {
                    _id: 'SlackBridge_Enabled',
                    value: true,
                },
            ],
            i18nLabel: 'SlackBridge_AppToken',
            i18nDescription: 'SlackBridge_AppToken_Description',
            secret: true,
        });
        yield this.add('SlackBridge_FileUpload_Enabled', true, {
            type: 'boolean',
            enableQuery: {
                _id: 'SlackBridge_Enabled',
                value: true,
            },
            i18nLabel: 'FileUpload',
        });
        yield this.add('SlackBridge_Out_Enabled', false, {
            type: 'boolean',
            enableQuery: {
                _id: 'SlackBridge_Enabled',
                value: true,
            },
        });
        yield this.add('SlackBridge_Out_All', false, {
            type: 'boolean',
            enableQuery: [
                {
                    _id: 'SlackBridge_Enabled',
                    value: true,
                },
                {
                    _id: 'SlackBridge_Out_Enabled',
                    value: true,
                },
            ],
        });
        yield this.add('SlackBridge_Out_Channels', '', {
            type: 'roomPick',
            enableQuery: [
                {
                    _id: 'SlackBridge_Enabled',
                    value: true,
                },
                {
                    _id: 'SlackBridge_Out_Enabled',
                    value: true,
                },
                {
                    _id: 'SlackBridge_Out_All',
                    value: false,
                },
            ],
        });
        yield this.add('SlackBridge_AliasFormat', '', {
            type: 'string',
            enableQuery: {
                _id: 'SlackBridge_Enabled',
                value: true,
            },
            i18nLabel: 'Alias_Format',
            i18nDescription: 'Alias_Format_Description',
        });
        yield this.add('SlackBridge_ExcludeBotnames', '', {
            type: 'string',
            enableQuery: {
                _id: 'SlackBridge_Enabled',
                value: true,
            },
            i18nLabel: 'Exclude_Botnames',
            i18nDescription: 'Exclude_Botnames_Description',
        });
        yield this.add('SlackBridge_Reactions_Enabled', true, {
            type: 'boolean',
            enableQuery: {
                _id: 'SlackBridge_Enabled',
                value: true,
            },
            i18nLabel: 'Reactions',
        });
        yield this.add('SlackBridge_Remove_Channel_Links', 'removeSlackBridgeChannelLinks', {
            type: 'action',
            actionText: 'Remove_Channel_Links',
            i18nDescription: 'SlackBridge_Remove_Channel_Links_Description',
            enableQuery: {
                _id: 'SlackBridge_Enabled',
                value: true,
            },
        });
    });
});
exports.createSlackBridgeSettings = createSlackBridgeSettings;
