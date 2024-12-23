"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareByRanking = void 0;
const compareByRanking = (rank) => (a, b) => {
    return rank(a) - rank(b);
};
exports.compareByRanking = compareByRanking;
