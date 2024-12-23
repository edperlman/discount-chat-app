"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isE2EEUpload = void 0;
const isE2EEUpload = (upload) => { var _a, _b; return Boolean(((_a = upload === null || upload === void 0 ? void 0 : upload.content) === null || _a === void 0 ? void 0 : _a.ciphertext) && ((_b = upload === null || upload === void 0 ? void 0 : upload.content) === null || _b === void 0 ? void 0 : _b.algorithm)); };
exports.isE2EEUpload = isE2EEUpload;
