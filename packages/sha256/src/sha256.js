"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHA256 = SHA256;
const binb2hex_1 = require("./binb2hex");
const core_1 = require("./core");
const str2binb_1 = require("./str2binb");
const utf8Encode_1 = require("./utf8Encode");
function SHA256(input) {
    input = (0, utf8Encode_1.utf8Encode)(input);
    const chrsz = 8;
    return (0, binb2hex_1.binb2hex)((0, core_1.core)((0, str2binb_1.str2binb)(input, chrsz), input.length * chrsz));
}
