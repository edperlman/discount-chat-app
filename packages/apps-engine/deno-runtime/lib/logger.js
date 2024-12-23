"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const stack_trace_1 = __importDefault(require("stack-trace"));
const AppObjectRegistry_ts_1 = require("../AppObjectRegistry.ts");
var LogMessageSeverity;
(function (LogMessageSeverity) {
    LogMessageSeverity["DEBUG"] = "debug";
    LogMessageSeverity["INFORMATION"] = "info";
    LogMessageSeverity["LOG"] = "log";
    LogMessageSeverity["WARNING"] = "warning";
    LogMessageSeverity["ERROR"] = "error";
    LogMessageSeverity["SUCCESS"] = "success";
})(LogMessageSeverity || (LogMessageSeverity = {}));
class Logger {
    constructor(method) {
        this.method = method;
        this.entries = [];
        this.start = new Date();
    }
    debug(...args) {
        this.addEntry(LogMessageSeverity.DEBUG, this.getStack(stack_trace_1.default.get()), ...args);
    }
    info(...args) {
        this.addEntry(LogMessageSeverity.INFORMATION, this.getStack(stack_trace_1.default.get()), ...args);
    }
    log(...args) {
        this.addEntry(LogMessageSeverity.LOG, this.getStack(stack_trace_1.default.get()), ...args);
    }
    warn(...args) {
        this.addEntry(LogMessageSeverity.WARNING, this.getStack(stack_trace_1.default.get()), ...args);
    }
    error(...args) {
        this.addEntry(LogMessageSeverity.ERROR, this.getStack(stack_trace_1.default.get()), ...args);
    }
    success(...args) {
        this.addEntry(LogMessageSeverity.SUCCESS, this.getStack(stack_trace_1.default.get()), ...args);
    }
    addEntry(severity, caller, ...items) {
        const i = items.map((args) => {
            if (args instanceof Error) {
                return JSON.stringify(args, Object.getOwnPropertyNames(args));
            }
            if (typeof args === 'object' && args !== null && 'stack' in args) {
                return JSON.stringify(args, Object.getOwnPropertyNames(args));
            }
            if (typeof args === 'object' && args !== null && 'message' in args) {
                return JSON.stringify(args, Object.getOwnPropertyNames(args));
            }
            const str = JSON.stringify(args, null, 2);
            return str ? JSON.parse(str) : str; // force call toJSON to prevent circular references
        });
        this.entries.push({
            caller,
            severity,
            method: this.method,
            timestamp: new Date(),
            args: i,
        });
    }
    getStack(stack) {
        let func = 'anonymous';
        if (stack.length === 1) {
            return func;
        }
        const frame = stack[1];
        if (frame.getMethodName() === null) {
            func = 'anonymous OR constructor';
        }
        else {
            func = frame.getMethodName();
        }
        if (frame.getFunctionName() !== null) {
            func = `${func} -> ${frame.getFunctionName()}`;
        }
        return func;
    }
    getTotalTime() {
        return new Date().getTime() - this.start.getTime();
    }
    hasEntries() {
        return this.entries.length > 0;
    }
    getLogs() {
        return {
            appId: AppObjectRegistry_ts_1.AppObjectRegistry.get('id'),
            method: this.method,
            entries: this.entries,
            startTime: this.start,
            endTime: new Date(),
            totalTime: this.getTotalTime(),
            _createdAt: new Date(),
        };
    }
}
exports.Logger = Logger;
