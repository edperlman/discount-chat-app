"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = parseCSV;
function parseCSV(csv, removeEmptyItems = true) {
    const items = csv.split(',').map((item) => item.trim());
    if (removeEmptyItems) {
        return items.filter(Boolean);
    }
    return items;
}
