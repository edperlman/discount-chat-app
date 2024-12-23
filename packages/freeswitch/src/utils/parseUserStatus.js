"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserStatus = parseUserStatus;
function parseUserStatus(status) {
    if (!status) {
        return 'UNKNOWN';
    }
    if (status === 'error/user_not_registered') {
        return 'UNREGISTERED';
    }
    if (status.startsWith('sofia/')) {
        return 'REGISTERED';
    }
    return 'UNKNOWN';
}
