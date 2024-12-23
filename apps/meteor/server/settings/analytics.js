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
exports.createAnalyticsSettings = void 0;
const server_1 = require("../../app/settings/server");
const createAnalyticsSettings = () => server_1.settingsRegistry.addGroup('Analytics', function addSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.section('Piwik', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = { _id: 'PiwikAnalytics_enabled', value: true };
                yield this.add('PiwikAnalytics_enabled', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'Enable',
                });
                yield this.add('PiwikAnalytics_url', '', {
                    type: 'string',
                    public: true,
                    i18nLabel: 'URL',
                    enableQuery,
                });
                yield this.add('PiwikAnalytics_siteId', '', {
                    type: 'string',
                    public: true,
                    i18nLabel: 'Client_ID',
                    enableQuery,
                });
                yield this.add('PiwikAdditionalTrackers', '', {
                    type: 'string',
                    multiline: true,
                    public: true,
                    i18nLabel: 'PiwikAdditionalTrackers',
                    enableQuery,
                });
                yield this.add('PiwikAnalytics_prependDomain', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'PiwikAnalytics_prependDomain',
                    enableQuery,
                });
                yield this.add('PiwikAnalytics_cookieDomain', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'PiwikAnalytics_cookieDomain',
                    enableQuery,
                });
                yield this.add('PiwikAnalytics_domains', '', {
                    type: 'string',
                    multiline: true,
                    public: true,
                    i18nLabel: 'PiwikAnalytics_domains',
                    enableQuery,
                });
            });
        });
        yield this.section('Analytics_Google', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const enableQuery = { _id: 'GoogleAnalytics_enabled', value: true };
                yield this.add('GoogleAnalytics_enabled', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'Enable',
                });
                yield this.add('GoogleAnalytics_ID', '', {
                    type: 'string',
                    public: true,
                    i18nLabel: 'Analytics_Google_id',
                    enableQuery,
                });
            });
        });
        yield this.section('Analytics_features_enabled', function addFeaturesEnabledSettings() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Analytics_features_messages', true, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'Messages',
                    i18nDescription: 'Analytics_features_messages_Description',
                });
                yield this.add('Analytics_features_rooms', true, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'Rooms',
                    i18nDescription: 'Analytics_features_rooms_Description',
                });
                yield this.add('Analytics_features_users', true, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'Users',
                    i18nDescription: 'Analytics_features_users_Description',
                });
                yield this.add('Engagement_Dashboard_Load_Count', 0, {
                    type: 'int',
                    hidden: true,
                });
            });
        });
    });
});
exports.createAnalyticsSettings = createAnalyticsSettings;
