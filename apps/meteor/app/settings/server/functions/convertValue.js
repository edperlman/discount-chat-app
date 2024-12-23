"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertValue = void 0;
const convertValue = (value, type) => {
    if (value.toLowerCase() === 'true') {
        return true;
    }
    if (value.toLowerCase() === 'false') {
        return false;
    }
    if (type === 'int') {
        return parseInt(value);
    }
    if (type === 'multiSelect') {
        return JSON.parse(value);
    }
    return value;
};
exports.convertValue = convertValue;
