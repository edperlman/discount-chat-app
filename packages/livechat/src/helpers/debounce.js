"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
const debounce = (func, delay) => {
    let inDebounce;
    function f(...args) {
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(this, args), delay);
        return this;
    }
    f.stop = () => clearTimeout(inDebounce);
    return f;
};
exports.debounce = debounce;
