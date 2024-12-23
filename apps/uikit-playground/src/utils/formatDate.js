"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
const moment_1 = __importDefault(require("moment"));
const formatDate = (date, type = 'll') => {
    return (0, moment_1.default)(date).format(type);
};
exports.formatDate = formatDate;
