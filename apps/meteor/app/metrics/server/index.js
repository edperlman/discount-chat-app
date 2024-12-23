"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsTracker = exports.metrics = void 0;
const metrics_1 = require("./lib/metrics");
Object.defineProperty(exports, "metrics", { enumerable: true, get: function () { return metrics_1.metrics; } });
const statsTracker_1 = __importDefault(require("./lib/statsTracker"));
exports.StatsTracker = statsTracker_1.default;
require("./lib/collectMetrics");
