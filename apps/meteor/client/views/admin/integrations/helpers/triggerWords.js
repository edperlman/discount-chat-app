"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerWordsToArray = triggerWordsToArray;
exports.triggerWordsToString = triggerWordsToString;
const separator = ',';
function triggerWordsToArray(s) {
    if (typeof s !== 'string' || s.length === 0) {
        return [];
    }
    return s.split(separator);
}
function triggerWordsToString(triggerWords) {
    var _a;
    return (_a = triggerWords === null || triggerWords === void 0 ? void 0 : triggerWords.join(separator)) !== null && _a !== void 0 ? _a : '';
}
