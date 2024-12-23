"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidJWT = exports.generateJWT = void 0;
const jsrsasign_1 = __importDefault(require("jsrsasign"));
const HEADER = {
    typ: 'JWT',
    alg: 'HS256',
};
const generateJWT = (payload, secret) => {
    const tokenPayload = {
        iat: jsrsasign_1.default.KJUR.jws.IntDate.get('now'),
        nbf: jsrsasign_1.default.KJUR.jws.IntDate.get('now'),
        exp: jsrsasign_1.default.KJUR.jws.IntDate.get('now + 1hour'),
        aud: 'RocketChat',
        context: payload,
    };
    const header = JSON.stringify(HEADER);
    return jsrsasign_1.default.KJUR.jws.JWS.sign(HEADER.alg, header, JSON.stringify(tokenPayload), { rstr: secret });
};
exports.generateJWT = generateJWT;
const isValidJWT = (jwt, secret) => {
    try {
        return jsrsasign_1.default.KJUR.jws.JWS.verify(jwt, secret, [HEADER.alg]);
    }
    catch (error) {
        return false;
    }
};
exports.isValidJWT = isValidJWT;
