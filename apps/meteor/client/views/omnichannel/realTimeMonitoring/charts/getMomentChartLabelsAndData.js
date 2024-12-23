"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMomentChartLabelsAndData = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getMomentChartLabelsAndData = (timestamp = Date.now()) => {
    const timingLabels = [];
    const initData = [];
    const today = (0, moment_timezone_1.default)(timestamp).startOf('day');
    for (let m = today; m.diff((0, moment_timezone_1.default)(timestamp), 'hours') < 0; m.add(1, 'hours')) {
        const n = (0, moment_timezone_1.default)(m).add(1, 'hours');
        timingLabels.push(`${m.format('hA')}-${n.format('hA')}`);
        initData.push(0);
    }
    return [timingLabels, initData];
};
exports.getMomentChartLabelsAndData = getMomentChartLabelsAndData;
