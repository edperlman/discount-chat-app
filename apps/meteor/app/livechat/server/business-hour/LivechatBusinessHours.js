"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultBusinessHourRow = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const mongodb_1 = require("mongodb");
const createDefaultBusinessHourRow = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const closedDays = ['Saturday', 'Sunday'];
    return {
        _id: new mongodb_1.ObjectId().toHexString(),
        name: '',
        active: true,
        type: core_typings_1.LivechatBusinessHourTypes.DEFAULT,
        ts: new Date(),
        workHours: days.map((day, index) => ({
            day,
            start: {
                time: '08:00',
                utc: {
                    dayOfWeek: (0, moment_timezone_1.default)(`${day}:08:00`, 'dddd:HH:mm').utc().format('dddd'),
                    time: (0, moment_timezone_1.default)(`${day}:08:00`, 'dddd:HH:mm').utc().format('HH:mm'),
                },
                cron: {
                    dayOfWeek: (0, moment_timezone_1.default)(`${day}:08:00`, 'dddd:HH:mm').format('dddd'),
                    time: (0, moment_timezone_1.default)(`${day}:08:00`, 'dddd:HH:mm').format('HH:mm'),
                },
            },
            finish: {
                time: '20:00',
                utc: {
                    dayOfWeek: (0, moment_timezone_1.default)(`${day}:20:00`, 'dddd:HH:mm').utc().format('dddd'),
                    time: (0, moment_timezone_1.default)(`${day}:20:00`, 'dddd:HH:mm').utc().format('HH:mm'),
                },
                cron: {
                    dayOfWeek: (0, moment_timezone_1.default)(`${day}:20:00`, 'dddd:HH:mm').format('dddd'),
                    time: (0, moment_timezone_1.default)(`${day}:20:00`, 'dddd:HH:mm').format('HH:mm'),
                },
            },
            code: index + 1,
            open: !closedDays.includes(day),
        })),
        timezone: {
            name: moment_timezone_1.default.tz.guess(),
            utc: String((0, moment_timezone_1.default)().utcOffset() / 60),
        },
    };
};
exports.createDefaultBusinessHourRow = createDefaultBusinessHourRow;
