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
exports.ClientSession = void 0;
const Session_1 = require("../Session");
class ClientSession extends Session_1.Session {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const sodium = yield this.sodium();
            const clientKeypair = yield sodium.crypto_box_keypair();
            this.secretKey = yield sodium.crypto_box_secretkey(clientKeypair);
            this.publicKey = yield sodium.crypto_box_publickey(clientKeypair);
            return this.publicKey.toString(this.stringFormatKey);
        });
    }
    setServerKey(serverPublic) {
        return __awaiter(this, void 0, void 0, function* () {
            const sodium = yield this.sodium();
            const [decryptKey, encryptKey] = yield sodium.crypto_kx_client_session_keys(this.publicKey, this.secretKey, this.publicKeyFromString(serverPublic));
            this.decryptKey = decryptKey;
            this.encryptKey = encryptKey;
        });
    }
}
exports.ClientSession = ClientSession;
