"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPatch = void 0;
const getFunctionPatches_1 = require("./getFunctionPatches");
const addPatch = (baseFunction, patch, condition) => {
    const patches = (0, getFunctionPatches_1.getFunctionPatches)(baseFunction);
    const patchData = {
        patchFunction: patch,
        condition,
    };
    patches.add(patchData);
    return () => {
        patches.delete(patchData);
    };
};
exports.addPatch = addPatch;
