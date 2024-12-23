"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePath = generatePath;
const path_to_regexp_1 = require("path-to-regexp");
function generatePath(path, params) {
    return (0, path_to_regexp_1.compile)(path, { encode: encodeURIComponent })(params);
}
