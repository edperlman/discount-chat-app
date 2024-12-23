"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
require("moment/locale/fa");
const getMomentChartLabelsAndData_1 = require("./getMomentChartLabelsAndData");
moment_timezone_1.default.tz.setDefault('UTC');
describe.each([
    [
        'en',
        [
            '12AM-1AM',
            '1AM-2AM',
            '2AM-3AM',
            '3AM-4AM',
            '4AM-5AM',
            '5AM-6AM',
            '6AM-7AM',
            '7AM-8AM',
            '8AM-9AM',
            '9AM-10AM',
            '10AM-11AM',
            '11AM-12PM',
        ],
    ],
    /** @see: https://github.com/RocketChat/Rocket.Chat/issues/30191 */
    [
        'fa',
        [
            '۱۲قبل از ظهر-۱قبل از ظهر',
            '۱قبل از ظهر-۲قبل از ظهر',
            '۲قبل از ظهر-۳قبل از ظهر',
            '۳قبل از ظهر-۴قبل از ظهر',
            '۴قبل از ظهر-۵قبل از ظهر',
            '۵قبل از ظهر-۶قبل از ظهر',
            '۶قبل از ظهر-۷قبل از ظهر',
            '۷قبل از ظهر-۸قبل از ظهر',
            '۸قبل از ظهر-۹قبل از ظهر',
            '۹قبل از ظهر-۱۰قبل از ظهر',
            '۱۰قبل از ظهر-۱۱قبل از ظهر',
            '۱۱قبل از ظهر-۱۲بعد از ظهر',
        ],
    ],
])(`%p language`, (language, expectedTimingLabels) => {
    beforeEach(() => {
        moment_timezone_1.default.locale(language);
    });
    it('should create timing labels from midnight to noon', () => {
        const [timingLabels] = (0, getMomentChartLabelsAndData_1.getMomentChartLabelsAndData)(12 * 60 * 60 * 1000);
        expect(timingLabels).toStrictEqual(expectedTimingLabels);
    });
});
