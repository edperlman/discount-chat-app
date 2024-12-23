"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNameChars = void 0;
const validateNameChars = (name) => {
    if (typeof name !== 'string') {
        return false;
    }
    const invalidChars = /[<>\\/]/;
    if (invalidChars.test(name)) {
        return false;
    }
    try {
        const decodedName = decodeURI(name);
        if (invalidChars.test(decodedName)) {
            return false;
        }
    }
    catch (err) {
        return false;
    }
    return true;
};
exports.validateNameChars = validateNameChars;
