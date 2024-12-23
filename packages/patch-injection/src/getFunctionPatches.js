"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionPatches = void 0;
const data_1 = require("./data");
const getFunctionPatches = (baseFunction) => {
    if (data_1.calledFunctions.has(baseFunction)) {
        throw new Error('Patching a function that was already used.');
    }
    const patches = data_1.functions.get(baseFunction);
    if (!patches) {
        throw new Error('Specified function can not be patched');
    }
    return patches;
};
exports.getFunctionPatches = getFunctionPatches;
