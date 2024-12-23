"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileAsDataURL = void 0;
const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (event) => {
        var _a;
        const result = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
        if (typeof result === 'string') {
            resolve(result);
            return;
        }
        reject(new Error('Failed to read file'));
    };
    reader.onerror = (event) => {
        reject(new Error(`Failed to read file: ${event}`));
    };
    reader.readAsDataURL(file);
});
exports.readFileAsDataURL = readFileAsDataURL;
