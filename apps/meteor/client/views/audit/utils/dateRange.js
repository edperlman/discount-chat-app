"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEndOfToday = exports.createStartOfToday = void 0;
const moment_1 = __importDefault(require("moment"));
const createStartOfToday = () => (0, moment_1.default)().startOf('day').toDate();
exports.createStartOfToday = createStartOfToday;
const createEndOfToday = () => (0, moment_1.default)().endOf('day').toDate();
exports.createEndOfToday = createEndOfToday;