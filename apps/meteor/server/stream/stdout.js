"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = getLogs;
const perf_hooks_1 = require("perf_hooks");
const log_format_1 = require("@rocket.chat/log-format");
const logger_1 = require("@rocket.chat/logger");
const ejson_1 = __importDefault(require("ejson"));
const Notifications_1 = __importDefault(require("../../app/notifications/server/lib/Notifications"));
const processString = (string, date) => {
    try {
        const obj = ejson_1.default.parse(string);
        if (!obj || typeof obj !== 'object') {
            throw new TypeError('Invalid JSON');
        }
        if ('toJSONValue' in obj) {
            return (0, log_format_1.format)(obj.toJSONValue(), { color: true });
        }
        if (!Array.isArray(obj) && !(obj instanceof Date) && !(obj instanceof Uint8Array)) {
            return (0, log_format_1.format)(obj, { color: true });
        }
        return (0, log_format_1.format)({
            message: string,
            time: date,
            level: 'info',
        }, { color: true });
    }
    catch (e) {
        return string;
    }
};
const rawTransformLog = (item) => {
    return {
        id: item.id,
        string: processString(item.data, item.ts),
        ts: item.ts,
    };
};
const timedTransformLog = (log) => {
    const timeStart = perf_hooks_1.performance.now();
    const item = rawTransformLog(log);
    const timeEnd = perf_hooks_1.performance.now();
    item.time = timeEnd - timeStart;
    return item;
};
const transformLog = process.env.STDOUT_METRICS === 'true' ? timedTransformLog : rawTransformLog;
logger_1.logEntries.on('log', (item) => {
    // TODO having this as 'emitWithoutBroadcast' will not sent this data to ddp-streamer, so this data
    // won't be available when using micro services.
    Notifications_1.default.streamStdout.emitWithoutBroadcast('stdout', transformLog(item));
});
function getLogs() {
    return (0, logger_1.getQueuedLogs)().map(transformLog);
}
