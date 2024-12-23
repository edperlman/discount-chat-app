"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeHtmlDots = void 0;
// default email engines - like gmail - will render texts with dots as an anchor tag.
// If we can, we should avoid that.
const safeHtmlDots = (text) => {
    return text.replace(/\./g, '&#8228');
};
exports.safeHtmlDots = safeHtmlDots;
