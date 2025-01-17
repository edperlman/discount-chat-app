"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConsole = void 0;
const stackTrace = __importStar(require("stack-trace"));
const accessors_1 = require("../../definition/accessors");
class AppConsole {
    static toStorageEntry(appId, logger) {
        return {
            appId,
            method: logger.getMethod(),
            entries: logger.getEntries(),
            startTime: logger.getStartTime(),
            endTime: logger.getEndTime(),
            totalTime: logger.getTotalTime(),
            _createdAt: new Date(),
        };
    }
    constructor(method) {
        this.method = method;
        this.entries = [];
        this.start = new Date();
    }
    debug(...items) {
        this.addEntry(accessors_1.LogMessageSeverity.DEBUG, this.getFunc(stackTrace.get()), ...items);
    }
    info(...items) {
        this.addEntry(accessors_1.LogMessageSeverity.INFORMATION, this.getFunc(stackTrace.get()), ...items);
    }
    log(...items) {
        this.addEntry(accessors_1.LogMessageSeverity.LOG, this.getFunc(stackTrace.get()), ...items);
    }
    warn(...items) {
        this.addEntry(accessors_1.LogMessageSeverity.WARNING, this.getFunc(stackTrace.get()), ...items);
    }
    error(...items) {
        this.addEntry(accessors_1.LogMessageSeverity.ERROR, this.getFunc(stackTrace.get()), ...items);
    }
    success(...items) {
        this.addEntry(accessors_1.LogMessageSeverity.SUCCESS, this.getFunc(stackTrace.get()), ...items);
    }
    getEntries() {
        return Array.from(this.entries);
    }
    getMethod() {
        return this.method;
    }
    getStartTime() {
        return this.start;
    }
    getEndTime() {
        return new Date();
    }
    getTotalTime() {
        return this.getEndTime().getTime() - this.getStartTime().getTime();
    }
    addEntry(severity, caller, ...items) {
        const i = items.map((v) => {
            if (v instanceof Error) {
                return JSON.stringify(v, Object.getOwnPropertyNames(v));
            }
            if (typeof v === 'object' && typeof v.stack === 'string' && typeof v.message === 'string') {
                return JSON.stringify(v, Object.getOwnPropertyNames(v));
            }
            const str = JSON.stringify(v, null, 2);
            return str ? JSON.parse(str) : str; // force call toJSON to prevent circular references
        });
        this.entries.push({
            caller,
            severity,
            timestamp: new Date(),
            args: i,
        });
        // This should be a setting? :thinking:
        // console.log(`${ severity.toUpperCase() }:`, i);
    }
    getFunc(stack) {
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
}
exports.AppConsole = AppConsole;
