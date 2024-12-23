"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDOMRect = void 0;
const normalizeDOMRect = (rect) => {
    if (!rect) {
        throw new Error('DOMRect is not defined');
    }
    const { left, top, right, bottom } = rect;
    return {
        left,
        top,
        right,
        bottom,
    };
};
exports.normalizeDOMRect = normalizeDOMRect;
