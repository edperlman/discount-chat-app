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
exports.createRetentionSettings = void 0;
const server_1 = require("../../app/settings/server");
const THIRTY_DAYS = 2592000000;
const createRetentionSettings = () => server_1.settingsRegistry.addGroup('RetentionPolicy', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const globalQuery = {
            _id: 'RetentionPolicy_Enabled',
            value: true,
        };
        yield this.add('RetentionPolicy_Enabled', false, {
            type: 'boolean',
            public: true,
            i18nLabel: 'RetentionPolicy_Enabled',
            alert: 'Watch out! Tweaking these settings without utmost care can destroy all message history. Please read <a href="https://docs.rocket.chat/use-rocket.chat/workspace-administration/settings/retention-policies" target="_blank">here</a> the documentation before turning the feature ON.',
        });
        yield this.add('RetentionPolicy_Precision', '0', {
            type: 'select',
            values: [
                {
                    key: '0',
                    i18nLabel: 'every_30_minutes',
                },
                {
                    key: '1',
                    i18nLabel: 'every_hour',
                },
                {
                    key: '2',
                    i18nLabel: 'every_six_hours',
                },
                {
                    key: '3',
                    i18nLabel: 'every_day',
                },
            ],
            public: true,
            i18nLabel: 'RetentionPolicy_Precision',
            i18nDescription: 'RetentionPolicy_Precision_Description',
            enableQuery: [
                globalQuery,
                {
                    _id: 'RetentionPolicy_Advanced_Precision',
                    value: false,
                },
            ],
        });
        yield this.add('RetentionPolicy_Advanced_Precision', false, {
            type: 'boolean',
            public: true,
            i18nLabel: 'RetentionPolicy_Advanced_Precision',
            i18nDescription: 'RetentionPolicy_Advanced_Precision_Description',
            enableQuery: globalQuery,
        });
        yield this.add('RetentionPolicy_Advanced_Precision_Cron', '*/30 * * * *', {
            type: 'string',
            public: true,
            i18nLabel: 'RetentionPolicy_Advanced_Precision_Cron',
            i18nDescription: 'RetentionPolicy_Advanced_Precision_Cron_Description',
            enableQuery: [globalQuery, { _id: 'RetentionPolicy_Advanced_Precision', value: true }],
        });
        yield this.section('Global Policy', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('RetentionPolicy_AppliesToChannels', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'RetentionPolicy_AppliesToChannels',
                    i18nDescription: 'RetentionPolicy_AppliesToChannels_Description',
                    enableQuery: globalQuery,
                });
                yield this.add('RetentionPolicy_TTL_Channels', THIRTY_DAYS, {
                    type: 'timespan',
                    public: true,
                    i18nLabel: 'RetentionPolicy_TTL_Channels',
                    enableQuery: [
                        {
                            _id: 'RetentionPolicy_AppliesToChannels',
                            value: true,
                        },
                        globalQuery,
                    ],
                });
                yield this.add('RetentionPolicy_AppliesToGroups', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'RetentionPolicy_AppliesToGroups',
                    i18nDescription: 'RetentionPolicy_AppliesToGroups_Description',
                    enableQuery: globalQuery,
                });
                yield this.add('RetentionPolicy_TTL_Groups', THIRTY_DAYS, {
                    type: 'timespan',
                    public: true,
                    i18nLabel: 'RetentionPolicy_TTL_Groups',
                    enableQuery: [
                        {
                            _id: 'RetentionPolicy_AppliesToGroups',
                            value: true,
                        },
                        globalQuery,
                    ],
                });
                yield this.add('RetentionPolicy_AppliesToDMs', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'RetentionPolicy_AppliesToDMs',
                    enableQuery: globalQuery,
                });
                yield this.add('RetentionPolicy_TTL_DMs', THIRTY_DAYS, {
                    type: 'timespan',
                    public: true,
                    i18nLabel: 'RetentionPolicy_TTL_DMs',
                    enableQuery: [
                        {
                            _id: 'RetentionPolicy_AppliesToDMs',
                            value: true,
                        },
                        globalQuery,
                    ],
                });
                yield this.add('RetentionPolicy_DoNotPrunePinned', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'RetentionPolicy_DoNotPrunePinned',
                    enableQuery: globalQuery,
                });
                yield this.add('RetentionPolicy_FilesOnly', false, {
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'RetentionPolicy_FilesOnly',
                    i18nDescription: 'RetentionPolicy_FilesOnly_Description',
                    enableQuery: globalQuery,
                });
                yield this.add('RetentionPolicy_DoNotPruneDiscussion', true, {
                    group: 'RetentionPolicy',
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'RetentionPolicy_DoNotPruneDiscussion',
                    i18nDescription: 'RetentionPolicy_DoNotPruneDiscussion_Description',
                    enableQuery: globalQuery,
                });
                yield this.add('RetentionPolicy_DoNotPruneThreads', true, {
                    group: 'RetentionPolicy',
                    type: 'boolean',
                    public: true,
                    i18nLabel: 'RetentionPolicy_DoNotPruneThreads',
                    i18nDescription: 'RetentionPolicy_DoNotPruneThreads_Description',
                    enableQuery: globalQuery,
                });
            });
        });
    });
});
exports.createRetentionSettings = createRetentionSettings;
