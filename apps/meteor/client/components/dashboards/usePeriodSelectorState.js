"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePeriodSelectorState = void 0;
const react_1 = require("react");
const usePeriodSelectorState = (...periods) => {
    const [period, setPeriod] = (0, react_1.useState)(periods[0]);
    return [
        period,
        {
            periods,
            value: period,
            onChange: (value) => setPeriod(value),
        },
    ];
};
exports.usePeriodSelectorState = usePeriodSelectorState;
