"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachedFunction = void 0;
const cachedFunction = (fn) => {
    const cache = new Map();
    return ((...args) => {
        const cacheKey = JSON.stringify(args);
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }
        const result = fn(...args);
        cache.set(cacheKey, result);
        return result;
    });
};
exports.cachedFunction = cachedFunction;
