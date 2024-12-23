"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirtyFields = void 0;
/**
 * Helper function to get dirty fields from react-hook-form
 * @param allFields all fields object
 * @param dirtyFields dirty fields object
 * @returns all dirty fields object
 */
const getDirtyFields = (allFields, dirtyFields) => {
    const dirtyFieldsObjValue = Object.keys(dirtyFields).reduce((acc, currentField) => {
        const isDirty = Array.isArray(dirtyFields[currentField])
            ? dirtyFields[currentField].some((value) => value === true)
            : dirtyFields[currentField] === true;
        if (isDirty) {
            return Object.assign(Object.assign({}, acc), { [currentField]: allFields[currentField] });
        }
        return acc;
    }, {});
    return dirtyFieldsObjValue;
};
exports.getDirtyFields = getDirtyFields;
