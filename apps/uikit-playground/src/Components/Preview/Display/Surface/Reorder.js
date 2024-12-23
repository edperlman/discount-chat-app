"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorder = void 0;
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
exports.reorder = reorder;
