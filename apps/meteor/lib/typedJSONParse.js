"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedJsonParse = void 0;
const typedJsonParse = (str) => {
    return JSON.parse(JSON.stringify(str));
};
exports.typedJsonParse = typedJsonParse;
