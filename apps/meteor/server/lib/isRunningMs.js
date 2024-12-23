"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRunningMs = isRunningMs;
/**
 * Checks if the server is running in micro services mode
 * @returns {boolean}
 */
function isRunningMs() {
    var _a;
    return !!((_a = process.env.TRANSPORTER) === null || _a === void 0 ? void 0 : _a.match(/^(?:nats|TCP)/));
}
