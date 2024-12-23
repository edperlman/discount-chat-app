"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientLogger = void 0;
/**
 * This class implements logger.
 * @remarks
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["fatal"] = 0] = "fatal";
    LogLevel[LogLevel["error"] = 1] = "error";
    LogLevel[LogLevel["warn"] = 2] = "warn";
    LogLevel[LogLevel["info"] = 3] = "info";
    LogLevel[LogLevel["debug"] = 4] = "debug";
    LogLevel[LogLevel["verbose"] = 5] = "verbose";
})(LogLevel || (LogLevel = {}));
class ClientLogger {
    constructor(module, _level = LogLevel.info) {
        this.logLevel = _level;
        this.module = module;
    }
    writeLog(level, log) {
        const logLine = `${new Date().toISOString()} ${LogLevel[level]}  ${this.module}::${log}`;
        if (this.logLevel && this.logLevel < level) {
            return;
        }
        switch (level) {
            case LogLevel.warn:
                console.warn(logLine);
                break;
            case LogLevel.error:
            case LogLevel.fatal:
                console.error(logLine);
                break;
            default: {
                console.log(logLine);
            }
        }
    }
    verbose(...args) {
        this.writeLog(LogLevel.verbose, args);
    }
    debug(...args) {
        this.writeLog(LogLevel.debug, args);
    }
    info(...args) {
        this.writeLog(LogLevel.info, args);
    }
    warn(...args) {
        this.writeLog(LogLevel.warn, args);
    }
    error(...args) {
        this.writeLog(LogLevel.error, args);
    }
    fatal(...args) {
        this.writeLog(LogLevel.fatal, args);
    }
    setLogLevel(level) {
        this.logLevel = level;
    }
}
exports.ClientLogger = ClientLogger;
