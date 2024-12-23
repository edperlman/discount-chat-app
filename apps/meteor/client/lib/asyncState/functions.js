"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.value = exports.reject = exports.resolve = exports.update = exports.reload = exports.rejected = exports.resolved = exports.updating = exports.loading = void 0;
const AsyncStatePhase_1 = require("./AsyncStatePhase");
const loading = () => ({
    phase: AsyncStatePhase_1.AsyncStatePhase.LOADING,
    value: undefined,
    error: undefined,
});
exports.loading = loading;
const updating = (value) => ({
    phase: AsyncStatePhase_1.AsyncStatePhase.UPDATING,
    value,
    error: undefined,
});
exports.updating = updating;
const resolved = (value) => ({
    phase: AsyncStatePhase_1.AsyncStatePhase.RESOLVED,
    value,
    error: undefined,
});
exports.resolved = resolved;
const rejected = (error) => ({
    phase: AsyncStatePhase_1.AsyncStatePhase.REJECTED,
    value: undefined,
    error,
});
exports.rejected = rejected;
const reload = (prevState) => {
    switch (prevState.phase) {
        case AsyncStatePhase_1.AsyncStatePhase.LOADING:
            return prevState;
        case AsyncStatePhase_1.AsyncStatePhase.UPDATING:
        case AsyncStatePhase_1.AsyncStatePhase.RESOLVED:
            return {
                phase: AsyncStatePhase_1.AsyncStatePhase.LOADING,
                value: prevState.value,
                error: undefined,
            };
        case AsyncStatePhase_1.AsyncStatePhase.REJECTED:
            return {
                phase: AsyncStatePhase_1.AsyncStatePhase.LOADING,
                value: undefined,
                error: prevState.error,
            };
    }
};
exports.reload = reload;
const update = (prevState) => {
    switch (prevState.phase) {
        case AsyncStatePhase_1.AsyncStatePhase.LOADING:
        case AsyncStatePhase_1.AsyncStatePhase.UPDATING:
            return prevState;
        case AsyncStatePhase_1.AsyncStatePhase.RESOLVED:
            return {
                phase: AsyncStatePhase_1.AsyncStatePhase.UPDATING,
                value: prevState.value,
                error: undefined,
            };
        case AsyncStatePhase_1.AsyncStatePhase.REJECTED:
            return {
                phase: AsyncStatePhase_1.AsyncStatePhase.LOADING,
                value: undefined,
                error: prevState.error,
            };
    }
};
exports.update = update;
const resolve = (prevState, value) => {
    switch (prevState.phase) {
        case AsyncStatePhase_1.AsyncStatePhase.LOADING:
        case AsyncStatePhase_1.AsyncStatePhase.UPDATING:
            return {
                phase: AsyncStatePhase_1.AsyncStatePhase.RESOLVED,
                value,
                error: undefined,
            };
        case AsyncStatePhase_1.AsyncStatePhase.RESOLVED:
        case AsyncStatePhase_1.AsyncStatePhase.REJECTED:
            return prevState;
    }
};
exports.resolve = resolve;
const reject = (prevState, error) => {
    switch (prevState.phase) {
        case AsyncStatePhase_1.AsyncStatePhase.LOADING:
        case AsyncStatePhase_1.AsyncStatePhase.UPDATING:
            return {
                phase: AsyncStatePhase_1.AsyncStatePhase.REJECTED,
                value: undefined,
                error,
            };
        case AsyncStatePhase_1.AsyncStatePhase.RESOLVED:
        case AsyncStatePhase_1.AsyncStatePhase.REJECTED:
            return prevState;
    }
};
exports.reject = reject;
const value = (state) => state.value;
exports.value = value;
const error = (state) => state.error;
exports.error = error;
