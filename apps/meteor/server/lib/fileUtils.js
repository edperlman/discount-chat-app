"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileName = fileName;
exports.joinPath = joinPath;
const path_1 = __importDefault(require("path"));
const filenamify_1 = __importDefault(require("filenamify"));
function fileName(name) {
    return (0, filenamify_1.default)(name, { replacement: '-' });
}
function joinPath(base, name) {
    return path_1.default.join(base, fileName(name));
}
