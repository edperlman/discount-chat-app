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
exports.decryptAES = exports.generateKeyPair = exports.exportKey = exports.importKeyRaw = exports.importKey = exports.deriveBits = exports.digest = exports.encryptAES = exports.joinEncryptedData = void 0;
const { subtle } = global.crypto;
const joinEncryptedData = ({ encryptedData, iv }) => {
    const cipherText = new Uint8Array(encryptedData);
    const output = new Uint8Array(iv.length + cipherText.length);
    output.set(iv, 0);
    output.set(cipherText, iv.length);
    return output;
};
exports.joinEncryptedData = joinEncryptedData;
const encryptAES = (_a) => __awaiter(void 0, [_a], void 0, function* ({ iv, _sessionKey, data, }) {
    return subtle.encrypt({
        name: 'AES-GCM',
        iv,
    }, _sessionKey, data);
});
exports.encryptAES = encryptAES;
const digest = (bits) => __awaiter(void 0, void 0, void 0, function* () {
    return subtle.digest({
        name: 'SHA-256',
    }, bits);
});
exports.digest = digest;
const deriveBits = (_a) => __awaiter(void 0, [_a], void 0, function* ({ ecdhObj, _keyPair }) {
    if (!_keyPair.privateKey) {
        throw new Error('No private key');
    }
    return subtle.deriveBits(ecdhObj, _keyPair.privateKey, 256);
});
exports.deriveBits = deriveBits;
const importKey = (publicKeyObject) => __awaiter(void 0, void 0, void 0, function* () {
    return subtle.importKey('jwk', publicKeyObject, {
        name: 'ECDH',
        namedCurve: 'P-256',
    }, false, []);
});
exports.importKey = importKey;
const importKeyRaw = (sessionKeyData) => __awaiter(void 0, void 0, void 0, function* () {
    return subtle.importKey('raw', sessionKeyData, {
        name: 'AES-GCM',
    }, false, ['encrypt', 'decrypt']);
});
exports.importKeyRaw = importKeyRaw;
const exportKey = (_keyPair) => __awaiter(void 0, void 0, void 0, function* () { return subtle.exportKey('jwk', _keyPair); });
exports.exportKey = exportKey;
const generateKeyPair = () => __awaiter(void 0, void 0, void 0, function* () {
    return subtle.generateKey({
        name: 'ECDH',
        namedCurve: 'P-256',
    }, false, ['deriveKey', 'deriveBits']);
});
exports.generateKeyPair = generateKeyPair;
const decryptAES = (cipherText, _sessionKey) => __awaiter(void 0, void 0, void 0, function* () {
    const iv = cipherText.slice(0, 12);
    cipherText = cipherText.slice(12);
    const data = yield subtle.decrypt({
        name: 'AES-GCM',
        iv,
    }, _sessionKey, cipherText);
    return data;
});
exports.decryptAES = decryptAES;
