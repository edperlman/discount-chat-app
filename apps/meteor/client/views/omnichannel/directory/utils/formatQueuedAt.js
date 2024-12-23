"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatQueuedAt = void 0;
const moment_1 = __importDefault(require("moment"));
const formatQueuedAt = (room) => {
    const { servedBy, closedAt, open, queuedAt, ts } = room || {};
    const queueStartedAt = queuedAt || ts;
    // Room served
    if (servedBy) {
        return (0, moment_1.default)(servedBy.ts).from((0, moment_1.default)(queueStartedAt), true);
    }
    // Room open and not served
    if (open) {
        return (0, moment_1.default)(queueStartedAt).fromNow(true);
    }
    // Room closed and not served
    if (closedAt && queueStartedAt) {
        return (0, moment_1.default)(closedAt).from((0, moment_1.default)(queueStartedAt), true);
    }
    return '';
};
exports.formatQueuedAt = formatQueuedAt;
