"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortAppsByClosestOrFarthestModificationDate = void 0;
const sortAppsByClosestOrFarthestModificationDate = (firstDateString, secondDateString) => {
    const firstDate = new Date(firstDateString);
    const secondDate = new Date(secondDateString);
    return +secondDate - +firstDate;
};
exports.sortAppsByClosestOrFarthestModificationDate = sortAppsByClosestOrFarthestModificationDate;
