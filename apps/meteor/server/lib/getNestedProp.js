"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNestedProp = void 0;
const getNestedProp = (customFields, property) => {
    try {
        return property.split('.').reduce((acc, el) => acc[el], customFields);
    }
    catch (_a) {
        // ignore errors
    }
};
exports.getNestedProp = getNestedProp;
