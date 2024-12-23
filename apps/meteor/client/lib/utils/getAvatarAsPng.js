"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarAsPng = void 0;
const getUserAvatarURL_1 = require("../../../app/utils/client/getUserAvatarURL");
const getAvatarAsPng = (username, cb) => {
    const image = new Image();
    const onLoad = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('failed to get canvas context');
        }
        context.drawImage(image, 0, 0);
        try {
            return cb(canvas.toDataURL('image/png'));
        }
        catch (e) {
            return cb('');
        }
    };
    const onError = () => cb('');
    image.onload = onLoad;
    image.onerror = onError;
    image.src = (0, getUserAvatarURL_1.getUserAvatarURL)(username || '');
    return onError;
};
exports.getAvatarAsPng = getAvatarAsPng;
