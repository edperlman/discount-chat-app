"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRelativeURL = void 0;
const isRelativeURL = (str) => /^[^\/]+\/[^\/].*$|^\/[^\/].*$/gim.test(str);
exports.isRelativeURL = isRelativeURL;
