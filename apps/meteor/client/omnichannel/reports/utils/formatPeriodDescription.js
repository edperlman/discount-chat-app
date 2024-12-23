"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPeriodDescription = void 0;
const periods_1 = require("../../../components/dashboards/periods");
const formatPeriodDescription = (periodKey, t) => {
    const { label } = (0, periods_1.getPeriod)(periodKey);
    return t(...label).toLocaleLowerCase();
};
exports.formatPeriodDescription = formatPeriodDescription;
