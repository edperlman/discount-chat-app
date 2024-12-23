"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop = void 0;
const getTop = (limit = 5, data, formatter) => {
    if (data.length < limit) {
        return data;
    }
    const topItems = data.slice(0, limit);
    const othersValue = data.slice(limit).reduce((total, item) => total + item.value, 0);
    return othersValue > 0 ? [...topItems, formatter(othersValue)] : topItems;
};
exports.getTop = getTop;
