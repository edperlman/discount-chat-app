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
exports.createCrowdSettings = exports.crowdIntervalValuesToCronMap = void 0;
const server_1 = require("../../app/settings/server");
exports.crowdIntervalValuesToCronMap = {
    every_10_minutes: '*/10 * * * *',
    every_30_minutes: '*/30 * * * *',
    every_1_hour: '0 * * * *',
    every_6_hours: '0 */6 * * *',
    every_12_hours: '0 */12 * * *',
};
const createCrowdSettings = () => server_1.settingsRegistry.addGroup('AtlassianCrowd', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const enableQuery = { _id: 'CROWD_Enable', value: true };
        const enableSyncQuery = [enableQuery, { _id: 'CROWD_Sync_User_Data', value: true }];
        yield this.add('CROWD_Enable', false, { type: 'boolean', public: true, i18nLabel: 'Enabled' });
        yield this.add('CROWD_URL', '', { type: 'string', enableQuery, i18nLabel: 'URL' });
        yield this.add('CROWD_Reject_Unauthorized', true, { type: 'boolean', enableQuery });
        yield this.add('CROWD_APP_USERNAME', '', {
            type: 'string',
            enableQuery,
            i18nLabel: 'Username',
            secret: true,
        });
        yield this.add('CROWD_APP_PASSWORD', '', {
            type: 'password',
            enableQuery,
            i18nLabel: 'Password',
            secret: true,
        });
        yield this.add('CROWD_Sync_User_Data', false, {
            type: 'boolean',
            enableQuery,
            i18nLabel: 'Sync_Users',
        });
        yield this.add('CROWD_Sync_Interval', 'every_1_hour', {
            type: 'select',
            values: [
                {
                    key: 'every_10_minutes',
                    i18nLabel: 'every_10_minutes',
                },
                {
                    key: 'every_30_minutes',
                    i18nLabel: 'every_30_minutes',
                },
                {
                    key: 'every_1_hour',
                    i18nLabel: 'every_hour',
                },
                {
                    key: 'every_6_hours',
                    i18nLabel: 'every_six_hours',
                },
                {
                    key: 'every_12_hours',
                    i18nLabel: 'every_12_hours',
                },
            ],
            enableQuery: enableSyncQuery,
            i18nLabel: 'Sync_Interval',
            i18nDescription: 'Crowd_sync_interval_Description',
        });
        yield this.add('CROWD_Remove_Orphaned_Users', false, {
            type: 'boolean',
            public: true,
            i18nLabel: 'Crowd_Remove_Orphaned_Users',
        });
        yield this.add('CROWD_Clean_Usernames', true, {
            type: 'boolean',
            enableQuery,
            i18nLabel: 'Clean_Usernames',
            i18nDescription: 'Crowd_clean_usernames_Description',
        });
        yield this.add('CROWD_Allow_Custom_Username', true, {
            type: 'boolean',
            i18nLabel: 'CROWD_Allow_Custom_Username',
        });
        yield this.add('CROWD_Test_Connection', 'crowd_test_connection', {
            type: 'action',
            actionText: 'Test_Connection',
            i18nLabel: 'Test_Connection',
        });
        yield this.add('CROWD_Sync_Users', 'crowd_sync_users', {
            type: 'action',
            actionText: 'Sync_Users',
            i18nLabel: 'Sync_Users',
        });
    });
});
exports.createCrowdSettings = createCrowdSettings;
