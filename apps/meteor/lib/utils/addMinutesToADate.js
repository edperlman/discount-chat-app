"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMinutesToADate = void 0;
const addMinutesToADate = (date, minutes) => {
    const minutesInMs = minutes * 60 * 1000;
    return new Date(date.getTime() + minutesInMs);
};
exports.addMinutesToADate = addMinutesToADate;
