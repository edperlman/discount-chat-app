"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDifference = exports.MINUTES = void 0;
exports.MINUTES = 1000 * 60;
const getDifference = (now, ts, scale = exports.MINUTES) => {
    const diff = now.getTime() - ts.getTime() / scale;
    return diff;
};
exports.getDifference = getDifference;
