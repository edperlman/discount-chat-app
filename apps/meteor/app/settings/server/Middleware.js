"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.use = void 0;
const pipe = (fn) => (...args) => fn(...args);
const use = (fn, middleware) => function (...context) {
    return middleware(context, pipe(fn.bind(this)));
};
exports.use = use;
