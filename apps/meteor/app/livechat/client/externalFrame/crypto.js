"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = generateKey;
exports.getKeyFromString = getKeyFromString;
exports.encrypt = encrypt;
function ab2str(buf) {
    return String.fromCharCode(...new Uint16Array(buf));
}
function generateKey() {
    return __awaiter(this, void 0, void 0, function* () {
        const key = yield crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
        const exportedKey = yield crypto.subtle.exportKey('jwk', key);
        return JSON.stringify(exportedKey);
    });
}
function getKeyFromString(keyStr) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = JSON.parse(keyStr);
        return crypto.subtle.importKey('jwk', key, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    });
}
function encrypt(text, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const vector = crypto.getRandomValues(new Uint8Array(16));
        const data = new TextEncoder().encode(text);
        const enc = yield crypto.subtle.encrypt({ name: 'AES-GCM', iv: vector }, key, data);
        const cipherText = new Uint8Array(enc);
        return encodeURIComponent(btoa(ab2str(vector) + ab2str(cipherText)));
    });
}
