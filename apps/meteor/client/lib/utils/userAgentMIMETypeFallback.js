"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAgentMIMETypeFallback = void 0;
/*
 * Some browsers don't support the MIME type for quicktime video encoder, so we need to
 * fallback to the 'video/mp4'. There are other fallbacks for other browsers, but this is
 * the only one we need for now.
 * @param type - the MIME type to check
 * @returns the MIME type to use
 */
const userAgentMIMETypeFallback = (type) => {
    const userAgent = navigator.userAgent.toLocaleLowerCase();
    if (type === 'video/quicktime' && userAgent.indexOf('safari') !== -1) {
        return 'video/mp4';
    }
    return type;
};
exports.userAgentMIMETypeFallback = userAgentMIMETypeFallback;
