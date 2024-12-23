"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRTL = void 0;
const rtlChars = '\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC';
const rtlDirCheck = new RegExp(`^[^${rtlChars}]*?[${rtlChars}]`);
const isRTL = (s) => rtlDirCheck.test(s);
exports.isRTL = isRTL;
