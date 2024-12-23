"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isURL = void 0;
/**
 * @todo rename it as isAbsoluteURL
 */
const isURL = (str) => /^(https?:\/\/|data:)/.test(str);
exports.isURL = isURL;
