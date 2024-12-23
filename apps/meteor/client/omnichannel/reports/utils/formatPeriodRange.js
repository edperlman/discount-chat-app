"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPeriodRange = void 0;
const periods_1 = require("../../../components/dashboards/periods");
const formatDate = (date) => {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};
const formatPeriodRange = (period) => {
    const { start, end } = (0, periods_1.getPeriodRange)(period);
    return {
        start: formatDate(start),
        end: formatDate(end),
    };
};
exports.formatPeriodRange = formatPeriodRange;
