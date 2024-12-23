"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttledCounter = throttledCounter;
const underscore_1 = require("underscore");
function throttledCounter(fn, wait) {
    let counter = 0;
    const throttledFn = (0, underscore_1.throttle)(() => {
        fn(counter);
        counter = 0;
    }, wait, { leading: false });
    return () => {
        counter++;
        throttledFn();
    };
}
