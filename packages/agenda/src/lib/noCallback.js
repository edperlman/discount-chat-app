"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noCallback = void 0;
const noCallback = (args, length = 0) => {
    if (args.length > length) {
        throw new Error(`This function does not accept a callback function. ${args.length}/${length}`);
    }
};
exports.noCallback = noCallback;
