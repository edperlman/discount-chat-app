"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatMemorySize = void 0;
const stringUtils_1 = require("../../lib/utils/stringUtils");
const formatMemorySize = (memorySize) => {
    if (typeof memorySize !== 'number') {
        return null;
    }
    const units = ['bytes', 'kB', 'MB', 'GB'];
    let order;
    for (order = 0; order < units.length - 1; ++order) {
        const upperLimit = Math.pow(1024, order + 1);
        if (memorySize < upperLimit) {
            break;
        }
    }
    const divider = Math.pow(1024, order);
    const decimalDigits = order === 0 ? 0 : 2;
    return `${(0, stringUtils_1.numberFormat)(memorySize / divider, decimalDigits)} ${units[order]}`;
};
const useFormatMemorySize = () => formatMemorySize;
exports.useFormatMemorySize = useFormatMemorySize;
