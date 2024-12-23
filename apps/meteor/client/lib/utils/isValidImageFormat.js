"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidImageFormat = void 0;
const isValidImageFormat = (dataURL) => {
    const img = new Image();
    return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = dataURL;
    });
};
exports.isValidImageFormat = isValidImageFormat;
