"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
require("moment/locale/fa");
const getMomentCurrentLabel_1 = require("./getMomentCurrentLabel");
moment_timezone_1.default.tz.setDefault('UTC');
describe.each([
    ['en', '12PM-1PM'],
    /** @see: https://github.com/RocketChat/Rocket.Chat/issues/30191 */
    ['fa', '۱۲بعد از ظهر-۱بعد از ظهر'],
])(`%p language`, (language, expectedLabel) => {
    beforeEach(() => {
        moment_timezone_1.default.locale(language);
    });
    it('should create timing labels from midnight to noon', () => {
        const label = (0, getMomentCurrentLabel_1.getMomentCurrentLabel)(12 * 60 * 60 * 1000);
        expect(label).toStrictEqual(expectedLabel);
    });
});
