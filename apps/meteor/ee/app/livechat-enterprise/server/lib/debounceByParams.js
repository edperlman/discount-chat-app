"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoizeDebounce = memoizeDebounce;
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const mem_1 = __importDefault(require("mem"));
// Debounce `func` based on passed parameters
// ref: https://github.com/lodash/lodash/issues/2403#issuecomment-816137402
function memoizeDebounce(func, wait = 0, options = {}) {
    const debounceMemo = (0, mem_1.default)(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (..._args) => (0, lodash_debounce_1.default)(func, wait, options));
    function wrappedFunction(...args) {
        return debounceMemo(...args)(...args);
    }
    wrappedFunction.flush = (...args) => {
        debounceMemo(...args).flush();
    };
    return wrappedFunction;
}
