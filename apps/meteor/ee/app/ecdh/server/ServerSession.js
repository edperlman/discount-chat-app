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
exports.ServerSession = void 0;
const Session_1 = require("../../../../app/ecdh/Session");
class ServerSession extends Session_1.Session {
    init(clientPublic) {
        return __awaiter(this, void 0, void 0, function* () {
            const sodium = yield this.sodium();
            const staticSeed = process.env.STATIC_SEED;
            if (!(staticSeed === null || staticSeed === void 0 ? void 0 : staticSeed.trim())) {
                console.error('STATIC_SEED environment variable is required');
                process.exit(1);
            }
            const serverKeypair = yield sodium.crypto_kx_seed_keypair(staticSeed + clientPublic);
            this.secretKey = yield sodium.crypto_box_secretkey(serverKeypair);
            this.publicKey = yield sodium.crypto_box_publickey(serverKeypair);
            const [decryptKey, encryptKey] = yield sodium.crypto_kx_server_session_keys(this.publicKey, this.secretKey, this.publicKeyFromString(clientPublic));
            this.decryptKey = decryptKey;
            this.encryptKey = encryptKey;
        });
    }
}
exports.ServerSession = ServerSession;
