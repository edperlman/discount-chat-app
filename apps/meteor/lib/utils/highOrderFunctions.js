"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDebouncing = exports.withThrottling = void 0;
const withThrottling = ({ wait, leading, trailing }) => (fn) => {
    let timer = undefined;
    let result;
    let previous = 0;
    function throttled(...args) {
        const now = Date.now();
        if (!previous && leading === false)
            previous = now;
        const remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (timer)
                clearTimeout(timer);
            timer = undefined;
            previous = now;
            result = fn.apply(this, args);
        }
        else if (!timer && trailing !== false) {
            const later = () => {
                previous = leading === false ? 0 : Date.now();
                result = fn.apply(this, args);
                timer = undefined;
            };
            timer = setTimeout(later, remaining);
        }
        return result;
    }
    const cancel = () => {
        if (timer)
            clearTimeout(timer);
        previous = 0;
        timer = undefined;
    };
    return Object.assign(throttled, { cancel });
};
exports.withThrottling = withThrottling;
const withDebouncing = ({ wait, immediate }) => (fn) => {
    let timer = undefined;
    let result;
    let previous;
    function debounced(...args) {
        previous = Date.now();
        if (!timer) {
            const later = () => {
                const passed = Date.now() - previous;
                if (wait > passed) {
                    timer = setTimeout(later, wait - passed);
                }
                else {
                    timer = undefined;
                    if (!immediate)
                        result = fn.apply(this, args);
                }
            };
            timer = setTimeout(later, wait);
            if (immediate)
                result = fn.apply(this, args);
        }
        return result;
    }
    const cancel = () => {
        clearTimeout(timer);
        timer = undefined;
    };
    return Object.assign(debounced, { cancel });
};
exports.withDebouncing = withDebouncing;
