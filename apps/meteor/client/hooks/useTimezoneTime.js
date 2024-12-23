"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimezoneTime = void 0;
const moment_1 = __importDefault(require("moment"));
const react_1 = require("react");
const useFormatTime_1 = require("./useFormatTime");
const useTimezoneTime = (offset, interval = 1000) => {
    const [time, setTime] = (0, react_1.useState)(() => (0, moment_1.default)().utcOffset(offset));
    const format = (0, useFormatTime_1.useFormatTime)();
    (0, react_1.useEffect)(() => {
        if (offset === undefined) {
            return;
        }
        const update = () => {
            setTime((0, moment_1.default)().utcOffset(offset));
        };
        const timer = setInterval(update, interval);
        update();
        return () => {
            clearInterval(timer);
        };
    }, [offset, interval]);
    return format(time);
};
exports.useTimezoneTime = useTimezoneTime;
