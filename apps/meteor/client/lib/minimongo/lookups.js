"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLookupFunction = void 0;
const comparisons_1 = require("./comparisons");
const isNullDocument = (doc) => doc === undefined || doc === null;
const isRecordDocument = (doc) => doc !== undefined && doc !== null && (typeof doc === 'object' || typeof doc === 'function');
const isIndexedByNumber = (value, isIndexedByNumber) => Array.isArray(value) || isIndexedByNumber;
const createLookupFunction = (key) => {
    const [first, rest] = key.split(/\.(.+)/);
    if (!rest) {
        return (doc) => {
            if (isNullDocument(doc) || !isRecordDocument(doc)) {
                return [undefined];
            }
            return [doc[first]];
        };
    }
    const lookupRest = (0, exports.createLookupFunction)(rest);
    const nextIsNumeric = /^\d+(\.|$)/.test(rest);
    return (doc) => {
        if (isNullDocument(doc) || !isRecordDocument(doc)) {
            return [undefined];
        }
        const firstLevel = doc[first];
        if ((0, comparisons_1.isEmptyArray)(firstLevel)) {
            return [undefined];
        }
        const docs = isIndexedByNumber(firstLevel, nextIsNumeric) ? firstLevel : [firstLevel];
        return Array.prototype.concat.apply([], docs.map(lookupRest));
    };
};
exports.createLookupFunction = createLookupFunction;
