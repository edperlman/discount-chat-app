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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleIdentityToken = handleIdentityToken;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const jsrsasign_1 = require("jsrsasign");
const node_rsa_1 = __importDefault(require("node-rsa"));
function isValidAppleJWT(identityToken, header) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield (0, server_fetch_1.serverFetch)('https://appleid.apple.com/auth/keys', { method: 'GET' });
        const applePublicKeys = (yield request.json()).keys;
        const { kid } = header;
        const key = applePublicKeys.find((k) => k.kid === kid);
        if (!key) {
            return false;
        }
        const pubKey = new node_rsa_1.default();
        pubKey.importKey({ n: Buffer.from(key.n, 'base64'), e: Buffer.from(key.e, 'base64') }, 'components-public');
        const userKey = pubKey.exportKey('public');
        try {
            return jsrsasign_1.KJUR.jws.JWS.verify(identityToken, userKey, ['RS256']);
        }
        catch (_a) {
            return false;
        }
    });
}
function handleIdentityToken(identityToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const decodedToken = jsrsasign_1.KJUR.jws.JWS.parse(identityToken);
        if (!(yield isValidAppleJWT(identityToken, decodedToken.headerObj))) {
            throw new Error('identityToken is not a valid JWT');
        }
        if (!decodedToken.payloadObj) {
            throw new Error('identityToken does not have a payload');
        }
        const { iss, sub, email } = decodedToken.payloadObj;
        if (!iss) {
            throw new Error('Insufficient data in auth response token');
        }
        const serviceData = {
            id: sub,
            email,
            name: '',
        };
        return serviceData;
    });
}
