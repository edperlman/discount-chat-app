"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.log = void 0;
const getConfig_1 = require("../../../client/lib/utils/getConfig");
let debug = undefined;
const isDebugEnabled = () => {
    if (debug === undefined) {
        debug = (0, getConfig_1.getConfig)('debug') === 'true' || (0, getConfig_1.getConfig)('debug-e2e') === 'true';
    }
    return debug;
};
const log = (context, ...msg) => {
    isDebugEnabled() && console.log(`[${context}]`, ...msg);
};
exports.log = log;
const logError = (context, ...msg) => {
    isDebugEnabled() && console.error(`[${context}]`, ...msg);
};
exports.logError = logError;
