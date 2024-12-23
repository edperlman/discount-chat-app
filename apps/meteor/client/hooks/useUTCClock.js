"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUTCClock = void 0;
const useTimezoneTime_1 = require("./useTimezoneTime");
const useUTCClock = (utcOffset) => {
    const time = (0, useTimezoneTime_1.useTimezoneTime)(utcOffset, 10000);
    return `${time} (UTC ${utcOffset})`;
};
exports.useUTCClock = useUTCClock;
