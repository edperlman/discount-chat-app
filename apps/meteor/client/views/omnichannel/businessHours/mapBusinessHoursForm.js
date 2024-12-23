"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultWorkHours = exports.DAYS_OF_WEEK = void 0;
exports.DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const closedDays = ['Saturday', 'Sunday'];
const defaultWorkHours = (allDays = false) => exports.DAYS_OF_WEEK.map((day) => ({
    day,
    start: {
        time: '08:00',
    },
    finish: {
        time: '18:00',
    },
    open: allDays ? true : !closedDays.includes(day),
}));
exports.defaultWorkHours = defaultWorkHours;
