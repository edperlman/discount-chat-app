"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageExtensionFromMime = void 0;
const extensionsMap = {
    'image/apng': 'apng',
    'image/avif': 'avif',
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
    'image/x-icon': 'ico',
    'image/tiff': 'tif',
};
const getImageExtensionFromMime = (mime) => extensionsMap[mime];
exports.getImageExtensionFromMime = getImageExtensionFromMime;
