"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalePercentage = void 0;
const getLocalePercentage = (locale, total, fraction, decimalCount = 2) => new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimalCount,
    maximumFractionDigits: decimalCount,
}).format(fraction / total);
exports.getLocalePercentage = getLocalePercentage;
