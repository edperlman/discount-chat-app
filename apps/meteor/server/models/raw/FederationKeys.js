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
exports.FederationKeysRaw = void 0;
const node_rsa_1 = __importDefault(require("node-rsa"));
const BaseRaw_1 = require("./BaseRaw");
class FederationKeysRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'federation_keys', trash);
    }
    getKey(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyResource = yield this.findOne({ type });
            if (!keyResource) {
                return null;
            }
            return keyResource.key;
        });
    }
    loadKey(keyData, type) {
        return new node_rsa_1.default(keyData, `pkcs8-${type}-pem`);
    }
    generateKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = new node_rsa_1.default({ b: 2048 });
            key.generateKeyPair();
            yield this.deleteMany({});
            yield this.insertOne({
                type: 'private',
                key: key.exportKey('pkcs8-private-pem').replace(/\n|\r/g, ''),
            });
            yield this.insertOne({
                type: 'public',
                key: key.exportKey('pkcs8-public-pem').replace(/\n|\r/g, ''),
            });
            return {
                privateKey: yield this.getPrivateKey(),
                publicKey: yield this.getPublicKey(),
            };
        });
    }
    getPrivateKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyData = yield this.getKey('private');
            return keyData && this.loadKey(keyData, 'private');
        });
    }
    getPrivateKeyString() {
        return this.getKey('private');
    }
    getPublicKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyData = yield this.getKey('public');
            return keyData && this.loadKey(keyData, 'public');
        });
    }
    getPublicKeyString() {
        return this.getKey('public');
    }
}
exports.FederationKeysRaw = FederationKeysRaw;
