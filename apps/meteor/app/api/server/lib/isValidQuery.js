"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidQuery = void 0;
const cleanQuery_1 = require("./cleanQuery");
exports.isValidQuery = Object.assign((query, allowedAttributes, allowedOperations) => {
    exports.isValidQuery.errors = [];
    if (!(query instanceof Object)) {
        throw new Error('query must be an object');
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return verifyQuery(query, allowedAttributes, allowedOperations);
}, {
    errors: [],
});
const verifyQuery = (query, allowedAttributes, allowedOperations, parent = '') => {
    return Object.entries((0, cleanQuery_1.removeDangerousProps)(query)).every(([key, value]) => {
        const path = parent ? `${parent}.${key}` : key;
        if (parent === '' && path.startsWith('$')) {
            if (!allowedOperations.includes(path)) {
                exports.isValidQuery.errors.push(`Invalid operation: ${path}`);
                return false;
            }
            if (!Array.isArray(value)) {
                exports.isValidQuery.errors.push(`Invalid parameter for operation: ${path} : ${value}`);
                return false;
            }
            return value.every((v) => verifyQuery(v, allowedAttributes, allowedOperations));
        }
        if (!allowedAttributes.some((allowedAttribute) => {
            if (allowedAttribute.endsWith('.*')) {
                return path.startsWith(allowedAttribute.replace('.*', ''));
            }
            if (allowedAttribute.endsWith('*') && !allowedAttribute.endsWith('.*')) {
                return true;
            }
            return path === allowedAttribute;
        })) {
            exports.isValidQuery.errors.push(`Invalid attribute: ${path}`);
            return false;
        }
        if (value instanceof Object) {
            return verifyQuery(value, allowedAttributes, allowedOperations, path);
        }
        return true;
    });
};
