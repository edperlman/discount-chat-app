"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueMicrotask = void 0;
// Ponyfill for queueMicrotask
exports.queueMicrotask = (typeof window !== 'undefined' && window.queueMicrotask) ||
    ((cb) => {
        Promise.resolve().then(cb);
    });
