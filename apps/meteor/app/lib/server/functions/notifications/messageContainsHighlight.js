"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageContainsHighlight = messageContainsHighlight;
const string_helpers_1 = require("@rocket.chat/string-helpers");
/**
 * Checks if a message contains a user highlight
 *
 * @param {string} message
 * @param {array|undefined} highlights
 *
 * @returns {boolean}
 */
function messageContainsHighlight(message, highlights) {
    if (!highlights || highlights.length === 0) {
        return false;
    }
    return highlights.some((highlight) => {
        const hl = (0, string_helpers_1.escapeRegExp)(highlight);
        const regexp = new RegExp(`(?<!:)\\b${hl}\\b:|:\\b${hl}(?!:)\\b|\\b(?<!:)${hl}(?!:)\\b`, 'i');
        return regexp.test(message.msg);
    });
}
