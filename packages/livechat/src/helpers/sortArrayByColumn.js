"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortArrayByColumn = void 0;
const sortArrayByColumn = (array, column, inverted) => array.sort((a, b) => {
    if (a[column] < b[column] && !inverted) {
        return -1;
    }
    return 1;
});
exports.sortArrayByColumn = sortArrayByColumn;
