"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunction = void 0;
const addPatch_1 = require("./addPatch");
const data_1 = require("./data");
const makeFunction = (fn) => {
    const patches = new Set();
    patches.add({
        patchFunction: (_next, ...args) => fn(...args),
    });
    const result = ((...args) => {
        let newFn = fn;
        for (const patch of patches) {
            if (patch.condition && !patch.condition()) {
                continue;
            }
            const nextFn = newFn;
            newFn = ((...args) => patch.patchFunction(nextFn, ...args));
        }
        data_1.calledFunctions.add(result);
        return newFn(...args);
    });
    data_1.functions.set(result, patches);
    result.patch = (patch, condition) => (0, addPatch_1.addPatch)(result, patch, condition);
    result.originalSignature = (() => {
        throw new Error('OriginalSignature of patched functions is not meant to be executed directly.');
    });
    result.patchSignature = (() => {
        throw new Error('PatchSignature of patched functions is not meant to be executed directly.');
    });
    return result;
};
exports.makeFunction = makeFunction;
