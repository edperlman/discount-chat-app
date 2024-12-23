"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeDeprecatedUsage = sanitizeDeprecatedUsage;
const mod_ts_1 = require("./ast/mod.ts");
function hasPotentialDeprecatedUsage(source) {
    return (
    // potential usage of Room.usernames getter
    source.includes('.usernames') ||
        // potential usage of LivechatRead.isOnline method
        source.includes('.isOnline(') ||
        // potential usage of LivechatCreator.createToken method
        source.includes('.createToken('));
}
function sanitizeDeprecatedUsage(source) {
    if (!hasPotentialDeprecatedUsage(source)) {
        return source;
    }
    return (0, mod_ts_1.fixBrokenSynchronousAPICalls)(source);
}
