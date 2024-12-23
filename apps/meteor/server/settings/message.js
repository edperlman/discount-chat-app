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
exports.createMessageSettings = void 0;
const MessageTypes_1 = require("../../app/lib/lib/MessageTypes");
const server_1 = require("../../app/settings/server");
const createMessageSettings = () => server_1.settingsRegistry.addGroup('Message', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.section('Message_Attachments', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Message_Attachments_Thumbnails_Enabled', true, {
                    type: 'boolean',
                    public: true,
                    i18nDescription: 'Message_Attachments_Thumbnails_EnabledDesc',
                });
                yield this.add('Message_Attachments_Thumbnails_Width', 480, {
                    type: 'int',
                    public: true,
                    enableQuery: [
                        {
                            _id: 'Message_Attachments_Thumbnails_Enabled',
                            value: true,
                        },
                    ],
                });
                yield this.add('Message_Attachments_Thumbnails_Height', 360, {
                    type: 'int',
                    public: true,
                    enableQuery: [
                        {
                            _id: 'Message_Attachments_Thumbnails_Enabled',
                            value: true,
                        },
                    ],
                });
                yield this.add('Message_Attachments_Strip_Exif', true, {
                    type: 'boolean',
                    public: true,
                    i18nDescription: 'Message_Attachments_Strip_ExifDescription',
                });
            });
        });
        yield this.section('Message_Audio', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Message_AudioRecorderEnabled', true, {
                    type: 'boolean',
                    public: true,
                    i18nDescription: 'Message_AudioRecorderEnabledDescription',
                });
                yield this.add('Message_Audio_bitRate', 32, {
                    type: 'int',
                    public: true,
                });
            });
        });
        yield this.section('Read_Receipts', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Message_Read_Receipt_Enabled', false, {
                    type: 'boolean',
                    enterprise: true,
                    invalidValue: false,
                    modules: ['message-read-receipt'],
                    public: true,
                });
                yield this.add('Message_Read_Receipt_Store_Users', false, {
                    type: 'boolean',
                    enterprise: true,
                    invalidValue: false,
                    modules: ['message-read-receipt'],
                    public: true,
                    enableQuery: { _id: 'Message_Read_Receipt_Enabled', value: true },
                });
            });
        });
        yield this.add('Message_CustomDomain_AutoLink', '', {
            type: 'string',
            public: true,
        });
        yield this.add('Message_AllowEditing', true, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_AllowEditing_BlockEditInMinutes', 0, {
            type: 'int',
            public: true,
            i18nDescription: 'Message_AllowEditing_BlockEditInMinutesDescription',
        });
        yield this.add('Message_AllowDeleting', true, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_AllowDeleting_BlockDeleteInMinutes', 0, {
            type: 'int',
            public: true,
            i18nDescription: 'Message_AllowDeleting_BlockDeleteInMinutes',
        });
        yield this.add('Message_AllowUnrecognizedSlashCommand', false, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_AllowDirectMessagesToYourself', true, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_AlwaysSearchRegExp', false, {
            type: 'boolean',
        });
        yield this.add('Message_ShowDeletedStatus', false, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_AllowBadWordsFilter', false, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_BadWordsFilterList', '', {
            type: 'string',
            public: true,
        });
        yield this.add('Message_BadWordsWhitelist', '', {
            type: 'string',
            public: true,
        });
        yield this.add('Message_KeepHistory', false, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_MaxAll', 0, {
            type: 'int',
            public: true,
        });
        yield this.add('Message_MaxAllowedSize', 5000, {
            type: 'int',
            public: true,
        });
        yield this.add('Message_AllowConvertLongMessagesToAttachment', true, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_GroupingPeriod', 300, {
            type: 'int',
            public: true,
            i18nDescription: 'Message_GroupingPeriodDescription',
        });
        yield this.add('API_Embed', true, {
            type: 'boolean',
            public: true,
        });
        yield this.add('API_Embed_UserAgent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36', {
            type: 'string',
            public: true,
        });
        yield this.add('API_EmbedCacheExpirationDays', 30, {
            type: 'int',
            public: false,
        });
        yield this.add('API_Embed_clear_cache_now', 'OEmbedCacheCleanup', {
            type: 'action',
            actionText: 'clear',
            i18nLabel: 'clear_cache_now',
        });
        // TODO: deprecate this setting in favor of App
        yield this.add('API_EmbedIgnoredHosts', 'localhost, 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16', {
            type: 'string',
            i18nDescription: 'API_EmbedIgnoredHosts_Description',
        });
        // TODO: deprecate this setting in favor of App
        yield this.add('API_EmbedSafePorts', '80, 443', {
            type: 'string',
        });
        yield this.add('Message_TimeFormat', 'LT', {
            type: 'string',
            public: true,
            i18nDescription: 'Message_TimeFormat_Description',
        });
        yield this.add('Message_DateFormat', 'LL', {
            type: 'string',
            public: true,
            i18nDescription: 'Message_DateFormat_Description',
        });
        yield this.add('Message_TimeAndDateFormat', 'LLL', {
            type: 'string',
            public: true,
            i18nDescription: 'Message_TimeAndDateFormat_Description',
        });
        yield this.add('Message_QuoteChainLimit', 2, {
            type: 'int',
            public: true,
        });
        yield this.add('Hide_System_Messages', [], {
            type: 'multiSelect',
            public: true,
            values: MessageTypes_1.MessageTypesValues,
        });
        yield this.add('DirectMesssage_maxUsers', 8, {
            type: 'int',
            public: true,
        });
        yield this.add('Message_ErasureType', 'Delete', {
            type: 'select',
            public: true,
            i18nDescription: 'Message_ErasureType_Description',
            values: [
                {
                    key: 'Keep',
                    i18nLabel: 'Message_ErasureType_Keep',
                },
                {
                    key: 'Delete',
                    i18nLabel: 'Message_ErasureType_Delete',
                },
                {
                    key: 'Unlink',
                    i18nLabel: 'Message_ErasureType_Unlink',
                },
            ],
        });
        yield this.add('Message_Code_highlight', 'javascript,css,markdown,dockerfile,json,go,rust,clean,bash,plaintext,powershell,scss,shell,yaml,vim', {
            type: 'string',
            public: true,
        });
        yield this.add('Message_Auditing_Panel_Load_Count', 0, {
            type: 'int',
            hidden: true,
        });
        yield this.add('Message_Auditing_Apply_Count', 0, {
            type: 'int',
            hidden: true,
        });
        yield this.add('Message_VideoRecorderEnabled', true, {
            type: 'boolean',
            public: true,
            i18nDescription: 'Message_VideoRecorderEnabledDescription',
        });
        yield this.add('AutoTranslate_Enabled', false, {
            type: 'boolean',
            group: 'Message',
            section: 'AutoTranslate',
            public: true,
        });
        yield this.add('AutoTranslate_AutoEnableOnJoinRoom', false, {
            type: 'boolean',
            group: 'Message',
            section: 'AutoTranslate',
            public: true,
            enableQuery: [{ _id: 'AutoTranslate_Enabled', value: true }],
        });
        yield this.add('AutoTranslate_ServiceProvider', 'google-translate', {
            type: 'select',
            group: 'Message',
            section: 'AutoTranslate',
            values: [
                {
                    key: 'google-translate',
                    i18nLabel: 'AutoTranslate_Google',
                },
                {
                    key: 'deepl-translate',
                    i18nLabel: 'AutoTranslate_DeepL',
                },
                {
                    key: 'microsoft-translate',
                    i18nLabel: 'AutoTranslate_Microsoft',
                },
            ],
            enableQuery: [{ _id: 'AutoTranslate_Enabled', value: true }],
            i18nLabel: 'AutoTranslate_ServiceProvider',
            public: true,
        });
        yield this.add('AutoTranslate_GoogleAPIKey', '', {
            type: 'string',
            group: 'Message',
            section: 'AutoTranslate_Google',
            public: false,
            i18nLabel: 'AutoTranslate_APIKey',
            enableQuery: [
                {
                    _id: 'AutoTranslate_Enabled',
                    value: true,
                },
                {
                    _id: 'AutoTranslate_ServiceProvider',
                    value: 'google-translate',
                },
            ],
        });
        yield this.add('AutoTranslate_DeepLAPIKey', '', {
            type: 'string',
            group: 'Message',
            section: 'AutoTranslate_DeepL',
            public: false,
            i18nLabel: 'AutoTranslate_APIKey',
            enableQuery: [
                {
                    _id: 'AutoTranslate_Enabled',
                    value: true,
                },
                {
                    _id: 'AutoTranslate_ServiceProvider',
                    value: 'deepl-translate',
                },
            ],
        });
        yield this.add('AutoTranslate_MicrosoftAPIKey', '', {
            type: 'string',
            group: 'Message',
            section: 'AutoTranslate_Microsoft',
            public: false,
            i18nLabel: 'AutoTranslate_Microsoft_API_Key',
            enableQuery: [
                {
                    _id: 'AutoTranslate_Enabled',
                    value: true,
                },
                {
                    _id: 'AutoTranslate_ServiceProvider',
                    value: 'microsoft-translate',
                },
            ],
        });
        yield this.add('HexColorPreview_Enabled', true, {
            type: 'boolean',
            i18nLabel: 'Enabled',
            group: 'Message',
            section: 'Hex_Color_Preview',
            public: true,
        });
        yield this.section('Katex', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = {
                    _id: 'Katex_Enabled',
                    value: true,
                };
                yield this.add('Katex_Enabled', true, {
                    type: 'boolean',
                    public: true,
                    i18nDescription: 'Katex_Enabled_Description',
                });
                yield this.add('Katex_Parenthesis_Syntax', true, {
                    type: 'boolean',
                    public: true,
                    enableQuery,
                    i18nDescription: 'Katex_Parenthesis_Syntax_Description',
                });
                yield this.add('Katex_Dollar_Syntax', false, {
                    type: 'boolean',
                    public: true,
                    enableQuery,
                    i18nDescription: 'Katex_Dollar_Syntax_Description',
                });
            });
        });
        yield this.section('Google Maps', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('MapView_Enabled', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'MapView_Enabled',
                    i18nDescription: 'MapView_Enabled_Description',
                });
                yield this.add('MapView_GMapsAPIKey', '', {
                    type: 'string',
                    public: true,
                    i18nLabel: 'MapView_GMapsAPIKey',
                    i18nDescription: 'MapView_GMapsAPIKey_Description',
                    secret: true,
                });
            });
        });
        yield this.add('Message_AllowPinning', true, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_AllowStarring', true, {
            type: 'boolean',
            public: true,
        });
        yield this.add('Message_CustomFields_Enabled', false, {
            type: 'boolean',
        });
        yield this.add('Message_CustomFields', `
{
	"properties": {
		"priority": {
			"type": "string",
			"nullable": false,
			"enum": ["low", "medium", "high"]
		}
	},
	"required": ["priority"]
}
		`, {
            type: 'code',
            code: 'application/json',
            invalidValue: '',
            multiline: true,
            enableQuery: [
                {
                    _id: 'Message_CustomFields_Enabled',
                    value: true,
                },
            ],
        });
    });
});
exports.createMessageSettings = createMessageSettings;
