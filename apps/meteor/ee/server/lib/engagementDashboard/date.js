"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalOfWeekItems = exports.diffBetweenDaysInclusive = exports.convertIntToDate = exports.convertDateToInt = exports.mapDateForAPI = exports.isDateISOString = void 0;
exports.transformDatesForAPI = transformDatesForAPI;
const mem_1 = __importDefault(require("mem"));
const moment_1 = __importDefault(require("moment"));
exports.isDateISOString = (0, mem_1.default)((input) => {
    const timestamp = Date.parse(input);
    return !Number.isNaN(timestamp) && new Date(timestamp).toISOString() === input;
}, { maxAge: 10000 });
const mapDateForAPI = (input) => {
    if (!(0, exports.isDateISOString)(input)) {
        throw new Error('invalid ISO 8601 date');
    }
    return new Date(Date.parse(input));
};
exports.mapDateForAPI = mapDateForAPI;
const convertDateToInt = (date) => parseInt((0, moment_1.default)(date).clone().format('YYYYMMDD'), 10);
exports.convertDateToInt = convertDateToInt;
const convertIntToDate = (intValue) => (0, moment_1.default)(intValue, 'YYYYMMDD').clone().toDate();
exports.convertIntToDate = convertIntToDate;
const diffBetweenDays = (start, end) => (0, moment_1.default)(new Date(start)).clone().diff(new Date(end), 'days');
const diffBetweenDaysInclusive = (start, end) => diffBetweenDays(start, end) + 1;
exports.diffBetweenDaysInclusive = diffBetweenDaysInclusive;
const getTotalOfWeekItems = (weekItems, property) => weekItems.reduce((acc, item) => {
    acc += item[property];
    return acc;
}, 0);
exports.getTotalOfWeekItems = getTotalOfWeekItems;
function transformDatesForAPI(start, end) {
    return {
        start: (0, exports.mapDateForAPI)(start),
        end: end ? (0, exports.mapDateForAPI)(end) : undefined,
    };
}
