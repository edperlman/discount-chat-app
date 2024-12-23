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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const getPino_1 = require("./getPino");
const logLevel_1 = require("./logLevel");
__exportStar(require("./getPino"), exports);
__exportStar(require("./logLevel"), exports);
__exportStar(require("./logQueue"), exports);
const getLevel = (level) => {
    switch (level) {
        case '0':
            return 'warn';
        case '1':
            return 'info';
        case '2':
            return 'debug';
        default:
            return 'warn';
    }
};
let defaultLevel = 'warn';
logLevel_1.logLevel.once('changed', (level) => {
    defaultLevel = getLevel(level);
});
class Logger {
    constructor(loggerLabel) {
        this.logger = (0, getPino_1.getPino)(loggerLabel, defaultLevel);
        logLevel_1.logLevel.on('changed', (level) => {
            this.logger.level = getLevel(level);
        });
    }
    section(name) {
        const child = this.logger.child({ section: name });
        logLevel_1.logLevel.on('changed', (level) => {
            child.level = getLevel(level);
        });
        return child;
    }
    level(newLevel) {
        this.logger.level = newLevel;
    }
    log(msg, ...args) {
        this.logger.info(msg, ...args);
    }
    debug(msg, ...args) {
        this.logger.debug(msg, ...args);
    }
    info(msg, ...args) {
        this.logger.info(msg, ...args);
    }
    startup(msg, ...args) {
        this.logger.startup(msg, ...args);
    }
    success(msg, ...args) {
        this.logger.info(msg, ...args);
    }
    warn(msg, ...args) {
        this.logger.warn(msg, ...args);
    }
    error(msg, ...args) {
        this.logger.error(msg, ...args);
    }
    method(msg, ...args) {
        this.logger.method(msg, ...args);
    }
    subscription(msg, ...args) {
        this.logger.subscription(msg, ...args);
    }
    fatal(err, ...args) {
        this.logger.fatal(err, ...args);
    }
}
exports.Logger = Logger;
