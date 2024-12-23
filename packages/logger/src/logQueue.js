"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEntries = void 0;
exports.setQueueLimit = setQueueLimit;
exports.getQueuedLogs = getQueuedLogs;
const events_1 = __importDefault(require("events"));
const { MOLECULER_LOG_LEVEL, STDOUT_VIEWER_DISABLED = 'false' } = process.env;
const queue = [];
const maxInt = 2147483647;
let queueLimit = 1000;
let queueSize = 0;
function setQueueLimit(limit) {
    queueLimit = limit;
    if (queueSize > queueLimit) {
        queue.splice(0, queueSize - queueLimit);
    }
}
function getQueuedLogs() {
    return queue;
}
exports.logEntries = new events_1.default();
const { write } = process.stdout;
function queueWrite(...args) {
    write.apply(process.stdout, args);
    const [str] = args;
    if (typeof str !== 'string') {
        return true;
    }
    const date = new Date();
    const item = {
        id: `logid-${queueSize}`,
        data: str,
        ts: date,
    };
    queue.push(item);
    queueSize = (queueSize + 1) & maxInt;
    if (queueSize > queueLimit) {
        queue.shift();
    }
    exports.logEntries.emit('log', item);
    return true;
}
if (String(MOLECULER_LOG_LEVEL).toLowerCase() !== 'debug' && STDOUT_VIEWER_DISABLED === 'false') {
    process.stdout.write = queueWrite;
}
