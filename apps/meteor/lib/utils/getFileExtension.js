"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileExtension = void 0;
const getFileExtension = (fileName) => {
    var _a;
    if (!fileName) {
        return 'file';
    }
    const arr = fileName.split('.');
    if (arr.length < 2 || (arr[0] === '' && arr.length === 2)) {
        return 'file';
    }
    return ((_a = arr.pop()) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase()) || 'file';
};
exports.getFileExtension = getFileExtension;
