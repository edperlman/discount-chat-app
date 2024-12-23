"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = isPlainObject;
function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
