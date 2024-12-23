"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePeriodLabel = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const periods_1 = require("./periods");
const usePeriodLabel = (period) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, react_1.useMemo)(() => t(...(0, periods_1.getPeriod)(period).label), [period, t]);
};
exports.usePeriodLabel = usePeriodLabel;
