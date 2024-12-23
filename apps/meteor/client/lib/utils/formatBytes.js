"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBytes = void 0;
const formatBytes = (bytes, decimals) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals || 0;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
exports.formatBytes = formatBytes;
