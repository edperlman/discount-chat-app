"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJSON = void 0;
const isJSON = (value) => {
    try {
        return !!JSON.parse(value);
    }
    catch (_a) {
        return false;
    }
};
exports.isJSON = isJSON;
