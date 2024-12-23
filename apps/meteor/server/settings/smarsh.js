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
exports.createSmarshSettings = exports.smarshIntervalValuesToCronMap = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const server_1 = require("../../app/settings/server");
exports.smarshIntervalValuesToCronMap = {
    every_30_seconds: '*/30 * * * * *',
    every_30_minutes: '*/30 * * * *',
    every_1_hours: '0 * * * *',
    every_6_hours: '0 */6 * * *',
};
const createSmarshSettings = () => server_1.settingsRegistry.addGroup('Smarsh', function addSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('Smarsh_Enabled', false, {
            type: 'boolean',
            i18nLabel: 'Smarsh_Enabled',
            enableQuery: {
                _id: 'From_Email',
                value: {
                    $exists: 1,
                    $ne: '',
                },
            },
        });
        yield this.add('Smarsh_Email', '', {
            type: 'string',
            i18nLabel: 'Smarsh_Email',
            placeholder: 'email@domain.com',
            secret: true,
        });
        yield this.add('Smarsh_MissingEmail_Email', 'no-email@example.com', {
            type: 'string',
            i18nLabel: 'Smarsh_MissingEmail_Email',
            placeholder: 'no-email@example.com',
        });
        const zoneValues = moment_timezone_1.default.tz.names().map(function _timeZonesToSettings(name) {
            return {
                key: name,
                i18nLabel: name,
            };
        });
        yield this.add('Smarsh_Timezone', 'America/Los_Angeles', {
            type: 'select',
            values: zoneValues,
        });
        yield this.add('Smarsh_Interval', 'every_30_minutes', {
            type: 'select',
            values: [
                {
                    key: 'every_30_seconds',
                    i18nLabel: 'every_30_seconds',
                },
                {
                    key: 'every_30_minutes',
                    i18nLabel: 'every_30_minutes',
                },
                {
                    key: 'every_1_hours',
                    i18nLabel: 'every_hour',
                },
                {
                    key: 'every_6_hours',
                    i18nLabel: 'every_six_hours',
                },
            ],
            enableQuery: {
                _id: 'From_Email',
                value: {
                    $exists: 1,
                    $ne: '',
                },
            },
        });
    });
});
exports.createSmarshSettings = createSmarshSettings;
