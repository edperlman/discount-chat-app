"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacesNestedValues = void 0;
const replacesNestedValues = (obj, key, value) => {
    const keys = key.split('.');
    const lastKey = keys.shift();
    if (!lastKey) {
        throw new Error(`Failed to assign custom field: ${key}`);
    }
    if (keys.length && obj[lastKey] !== undefined && (typeof obj[lastKey] !== 'object' || Array.isArray(obj[lastKey]))) {
        throw new Error(`Failed to assign custom field: ${key}`);
    }
    if (keys.length === 0 && typeof obj[lastKey] === 'object') {
        throw new Error(`Failed to assign custom field: ${key}`);
    }
    return Object.assign(Object.assign(Object.assign({}, obj), (keys.length === 0 && {
        [lastKey]: value,
    })), (keys.length > 0 && {
        [lastKey]: (0, exports.replacesNestedValues)(obj[lastKey], keys.join('.'), value),
    }));
};
exports.replacesNestedValues = replacesNestedValues;
