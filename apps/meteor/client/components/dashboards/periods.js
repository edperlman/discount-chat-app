"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeriodRange = exports.getPeriod = void 0;
const moment_1 = __importDefault(require("moment"));
const label = (translationKey) => [translationKey];
const lastNDays = (n) => (utc) => {
    const date = new Date();
    const offsetForMoment = -(date.getTimezoneOffset() / 60);
    const start = utc
        ? moment_1.default.utc().startOf('day').subtract(n, 'days').toDate()
        : (0, moment_1.default)().subtract(n, 'days').startOf('day').utcOffset(offsetForMoment).toDate();
    const end = utc ? moment_1.default.utc().endOf('day').toDate() : (0, moment_1.default)().endOf('day').utcOffset(offsetForMoment).toDate();
    return { start, end };
};
const periods = [
    {
        key: 'today',
        label: label('Today'),
        range: lastNDays(0),
    },
    {
        key: 'this week',
        label: label('This_week'),
        range: lastNDays(7),
    },
    {
        key: 'last 7 days',
        label: label('Last_7_days'),
        range: lastNDays(7),
    },
    {
        key: 'last 15 days',
        label: label('Last_15_days'),
        range: lastNDays(15),
    },
    {
        key: 'this month',
        label: label('This_month'),
        range: lastNDays(30),
    },
    {
        key: 'last 30 days',
        label: label('Last_30_days'),
        range: lastNDays(30),
    },
    {
        key: 'last 90 days',
        label: label('Last_90_days'),
        range: lastNDays(90),
    },
    {
        key: 'last 6 months',
        label: label('Last_6_months'),
        range: lastNDays(180),
    },
    {
        key: 'last year',
        label: label('Last_year'),
        range: lastNDays(365),
    },
];
const getPeriod = (key) => {
    const period = periods.find((period) => period.key === key);
    if (!period) {
        throw new Error(`"${key}" is not a valid period key`);
    }
    return period;
};
exports.getPeriod = getPeriod;
const getPeriodRange = (key, utc = true) => {
    const period = periods.find((period) => period.key === key);
    if (!period) {
        throw new Error(`"${key}" is not a valid period key`);
    }
    return period.range(utc);
};
exports.getPeriodRange = getPeriodRange;
