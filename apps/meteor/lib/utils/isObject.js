"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = isObject;
function isObject(obj) {
    const type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
}
