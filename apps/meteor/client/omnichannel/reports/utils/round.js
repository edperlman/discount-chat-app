"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = void 0;
const round = (value, decimals = 2) => {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
};
exports.round = round;
