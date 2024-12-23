"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncStatePhase = exports.useAsyncState = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const asyncState_1 = require("../lib/asyncState");
Object.defineProperty(exports, "AsyncStatePhase", { enumerable: true, get: function () { return asyncState_1.AsyncStatePhase; } });
const useAsyncState = (initialValue) => {
    const [state, setState] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(() => {
        if (typeof initialValue === 'undefined') {
            return asyncState_1.asyncState.loading();
        }
        return asyncState_1.asyncState.resolved(typeof initialValue === 'function' ? initialValue() : initialValue);
    }));
    const resolve = (0, react_1.useCallback)((value) => {
        setState((state) => {
            if (typeof value === 'function') {
                return asyncState_1.asyncState.resolve(state, value(state.value));
            }
            return asyncState_1.asyncState.resolve(state, value);
        });
    }, [setState]);
    const reject = (0, react_1.useCallback)((error) => {
        setState((state) => asyncState_1.asyncState.reject(state, error));
    }, [setState]);
    const update = (0, react_1.useCallback)(() => {
        setState((state) => asyncState_1.asyncState.update(state));
    }, [setState]);
    const reset = (0, react_1.useCallback)(() => {
        setState((state) => asyncState_1.asyncState.reload(state));
    }, [setState]);
    return (0, react_1.useMemo)(() => (Object.assign(Object.assign({}, state), { resolve,
        reject,
        reset,
        update })), [state, resolve, reject, reset, update]);
};
exports.useAsyncState = useAsyncState;
