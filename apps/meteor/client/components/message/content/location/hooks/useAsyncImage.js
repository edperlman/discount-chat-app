"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAsyncImage = void 0;
const react_1 = require("react");
const useAsyncState_1 = require("../../../../../hooks/useAsyncState");
const useAsyncImage = (src) => {
    const { value, resolve, reject, reset } = (0, useAsyncState_1.useAsyncState)();
    (0, react_1.useEffect)(() => {
        reset();
        if (!src) {
            return;
        }
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image.src);
        });
        image.addEventListener('error', (e) => {
            reject(e.error);
        });
        image.src = src;
    }, [src, resolve, reject, reset]);
    return value;
};
exports.useAsyncImage = useAsyncImage;
