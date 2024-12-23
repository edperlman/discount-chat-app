"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModifiedHttpHeaders = void 0;
const getModifiedHttpHeaders = (httpHeaders) => {
    const modifiedHttpHeaders = Object.assign({}, httpHeaders);
    if ('x-auth-token' in modifiedHttpHeaders) {
        modifiedHttpHeaders['x-auth-token'] = '[redacted]';
    }
    if (modifiedHttpHeaders.cookie) {
        const cookies = modifiedHttpHeaders.cookie.split('; ');
        const modifiedCookies = cookies.map((cookie) => {
            if (cookie.startsWith('rc_token=')) {
                return 'rc_token=[redacted]';
            }
            return cookie;
        });
        modifiedHttpHeaders.cookie = modifiedCookies.join('; ');
    }
    return modifiedHttpHeaders;
};
exports.getModifiedHttpHeaders = getModifiedHttpHeaders;
