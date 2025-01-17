"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRange = void 0;
const moment_1 = __importDefault(require("moment"));
const getDateRange = () => {
    const today = (0, moment_1.default)(new Date());
    const start = (0, moment_1.default)(new Date(today.year(), today.month(), today.date(), 0, 0, 0));
    const end = (0, moment_1.default)(new Date(today.year(), today.month(), today.date(), 23, 59, 59));
    return {
        start: start.toISOString(),
        end: end.toISOString(),
    };
};
exports.getDateRange = getDateRange;
