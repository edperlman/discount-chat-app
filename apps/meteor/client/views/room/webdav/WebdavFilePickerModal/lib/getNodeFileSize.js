"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeFileSize = void 0;
const getNodeFileSize = (type, size) => {
    if (type === 'directory') {
        return '';
    }
    const bytes = size;
    if (bytes === 0) {
        return '0 B';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
exports.getNodeFileSize = getNodeFileSize;
