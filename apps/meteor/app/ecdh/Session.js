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
exports.Session = void 0;
const sodium_plus_1 = require("sodium-plus");
class Session {
    constructor() {
        // Encoding for the key exchange, no requirements to be small
        this.stringFormatKey = 'base64';
        // Encoding for the transfer of encrypted data, should be smaller as possible
        this.stringFormatEncryptedData = 'base64';
        // Encoding before the encryption to keep unicode chars
        this.stringFormatRawData = 'base64';
    }
    sodium() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Session.sodium) {
                Session.sodium = yield sodium_plus_1.SodiumPlus.auto();
            }
            return Session.sodium;
        });
    }
    get publicKeyString() {
        return this.publicKey.toString(this.stringFormatKey);
    }
    publicKeyFromString(text) {
        return new sodium_plus_1.X25519PublicKey(Buffer.from(text, this.stringFormatKey));
    }
    encryptToBuffer(plaintext) {
        return __awaiter(this, void 0, void 0, function* () {
            const sodium = yield this.sodium();
            const nonce = yield sodium.randombytes_buf(24);
            const ciphertext = yield sodium.crypto_secretbox(Buffer.from(plaintext).toString(this.stringFormatRawData), nonce, this.encryptKey);
            return Buffer.concat([nonce, ciphertext]);
        });
    }
    encrypt(plaintext) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this.encryptToBuffer(plaintext);
            return buffer.toString(this.stringFormatEncryptedData);
        });
    }
    decryptToBuffer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sodium = yield this.sodium();
            const buffer = Buffer.from(Buffer.isBuffer(data) ? data.toString() : data, this.stringFormatEncryptedData);
            const decrypted = yield sodium.crypto_secretbox_open(buffer.slice(24), buffer.slice(0, 24), this.decryptKey);
            return Buffer.from(decrypted.toString(), this.stringFormatRawData);
        });
    }
    decrypt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this.decryptToBuffer(data);
            return buffer.toString();
        });
    }
}
exports.Session = Session;
