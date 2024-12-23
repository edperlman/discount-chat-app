"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.str2binb = str2binb;
function str2binb(str, chrsz) {
    const bin = [];
    const mask = (1 << chrsz) - 1;
    for (let i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
    }
    return bin;
}
