"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ellipsis = void 0;
const ellipsis = (value, max) => {
    return String(value).length > max ? `${String(value).substring(0, max)}...` : value;
};
exports.ellipsis = ellipsis;
