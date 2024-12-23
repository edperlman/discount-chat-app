"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormattedRelativeTime = void 0;
const moment_1 = __importDefault(require("moment"));
const react_1 = require("react");
const useFormattedRelativeTime = (timeMs) => (0, react_1.useMemo)(() => {
    moment_1.default.relativeTimeThreshold('s', 60);
    moment_1.default.relativeTimeThreshold('ss', 0);
    moment_1.default.relativeTimeThreshold('m', 60);
    moment_1.default.relativeTimeThreshold('h', 24);
    moment_1.default.relativeTimeThreshold('d', 31);
    moment_1.default.relativeTimeThreshold('M', 12);
    return moment_1.default.duration(timeMs).humanize();
}, [timeMs]);
exports.useFormattedRelativeTime = useFormattedRelativeTime;
