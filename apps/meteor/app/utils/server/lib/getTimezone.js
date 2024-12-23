"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimezone = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const server_1 = require("../../../settings/server");
const padOffset = (offset) => {
    const numberOffset = Number(offset);
    const absOffset = Math.abs(numberOffset);
    const isNegative = !(numberOffset === absOffset);
    return `${isNegative ? '-' : '+'}${absOffset < 10 ? `0${absOffset}` : absOffset}:00`;
};
const guessTimezoneFromOffset = (offset) => {
    if (!offset) {
        return moment_timezone_1.default.tz.guess();
    }
    return moment_timezone_1.default.tz.names().find((tz) => padOffset(offset) === moment_timezone_1.default.tz(tz).format('Z').toString()) || moment_timezone_1.default.tz.guess();
};
const getTimezone = (user) => {
    const timezone = server_1.settings.get('Default_Timezone_For_Reporting');
    switch (timezone) {
        case 'custom':
            return server_1.settings.get('Default_Custom_Timezone');
        case 'user':
            return guessTimezoneFromOffset(user === null || user === void 0 ? void 0 : user.utcOffset);
        default:
            return moment_timezone_1.default.tz.guess();
    }
};
exports.getTimezone = getTimezone;
