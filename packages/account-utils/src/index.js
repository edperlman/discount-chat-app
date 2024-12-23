"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashLoginToken = hashLoginToken;
const crypto_1 = __importDefault(require("crypto"));
function hashLoginToken(loginToken) {
    const hash = crypto_1.default.createHash('sha256');
    hash.update(loginToken);
    return hash.digest('base64');
}
