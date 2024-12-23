"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = void 0;
const throttle = (func, limit) => {
    let inThrottle = false;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};
exports.throttle = throttle;
