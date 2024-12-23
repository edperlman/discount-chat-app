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
exports.sign = sign;
exports.verify = verify;
exports.getPairs = getPairs;
const jose_1 = require("jose");
function sign(keyObject_1, pkcs8_1) {
    return __awaiter(this, arguments, void 0, function* (keyObject, pkcs8, alg = 'RS256') {
        const privateKey = yield (0, jose_1.importPKCS8)(pkcs8, alg);
        const token = yield new jose_1.SignJWT(keyObject).setProtectedHeader({ alg, typ: 'JWT' }).sign(privateKey);
        return token;
    });
}
function verify(jwt_1, spki_1) {
    return __awaiter(this, arguments, void 0, function* (jwt, spki, alg = 'RS256') {
        const publicKey = yield (0, jose_1.importSPKI)(spki, alg);
        const { payload, protectedHeader } = yield (0, jose_1.jwtVerify)(jwt, publicKey, {});
        return [payload, protectedHeader];
    });
}
function getPairs() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('This function should only be used in tests');
        }
        const { publicKey, privateKey } = yield (0, jose_1.generateKeyPair)('RS256');
        const spki = yield (0, jose_1.exportSPKI)(publicKey);
        const pkcs8 = yield (0, jose_1.exportPKCS8)(privateKey);
        return [spki, pkcs8];
    });
}
