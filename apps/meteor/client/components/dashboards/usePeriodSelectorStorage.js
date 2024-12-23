"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePeriodSelectorStorage = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const usePeriodSelectorStorage = (storageKey, periods) => {
    const [period, setPeriod] = (0, fuselage_hooks_1.useLocalStorage)(storageKey, periods[0]);
    return [
        period,
        {
            periods,
            value: period,
            onChange: (value) => setPeriod(value),
        },
    ];
};
exports.usePeriodSelectorStorage = usePeriodSelectorStorage;
