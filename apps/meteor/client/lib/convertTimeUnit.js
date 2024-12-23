"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msToTimeUnit = exports.timeUnitToMs = exports.isValidTimespan = exports.TIMEUNIT = void 0;
var TIMEUNIT;
(function (TIMEUNIT) {
    TIMEUNIT["days"] = "days";
    TIMEUNIT["hours"] = "hours";
    TIMEUNIT["minutes"] = "minutes";
})(TIMEUNIT || (exports.TIMEUNIT = TIMEUNIT = {}));
const isValidTimespan = (timespan) => {
    if (Number.isNaN(timespan)) {
        return false;
    }
    if (!Number.isFinite(timespan)) {
        return false;
    }
    if (timespan < 0) {
        return false;
    }
    return true;
};
exports.isValidTimespan = isValidTimespan;
const timeUnitToMs = (unit, timespan) => {
    if (!(0, exports.isValidTimespan)(timespan)) {
        throw new Error(`timeUnitToMs - invalid timespan:${timespan}`);
    }
    switch (unit) {
        case TIMEUNIT.days:
            return timespan * 24 * 60 * 60 * 1000;
        case TIMEUNIT.hours:
            return timespan * 60 * 60 * 1000;
        case TIMEUNIT.minutes:
            return timespan * 60 * 1000;
        default:
            throw new Error('timeUnitToMs - invalid time unit');
    }
};
exports.timeUnitToMs = timeUnitToMs;
const msToTimeUnit = (unit, timespan) => {
    if (!(0, exports.isValidTimespan)(timespan)) {
        throw new Error(`msToTimeUnit - invalid timespan:${timespan}`);
    }
    switch (unit) {
        case TIMEUNIT.days:
            return timespan / 24 / 60 / 60 / 1000;
        case TIMEUNIT.hours:
            return timespan / 60 / 60 / 1000;
        case TIMEUNIT.minutes:
            return timespan / 60 / 1000;
        default:
            throw new Error('msToTimeUnit - invalid time unit');
    }
};
exports.msToTimeUnit = msToTimeUnit;
