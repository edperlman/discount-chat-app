"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMomentCurrentLabel = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getMomentCurrentLabel = (timestamp = Date.now()) => {
    const m = (0, moment_timezone_1.default)(timestamp);
    const n = (0, moment_timezone_1.default)(m).add(1, 'hours');
    return `${m.format('hA')}-${n.format('hA')}`;
};
exports.getMomentCurrentLabel = getMomentCurrentLabel;
