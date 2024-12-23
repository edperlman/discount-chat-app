"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimezoneNameList = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const react_1 = require("react");
const useTimezoneNameList = () => (0, react_1.useMemo)(() => moment_timezone_1.default.tz.names(), []);
exports.useTimezoneNameList = useTimezoneNameList;
