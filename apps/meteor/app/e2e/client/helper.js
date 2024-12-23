"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.toString = toString;
exports.toArrayBuffer = toArrayBuffer;
exports.joinVectorAndEcryptedData = joinVectorAndEcryptedData;
exports.splitVectorAndEcryptedData = splitVectorAndEcryptedData;
exports.encryptRSA = encryptRSA;
exports.encryptAES = encryptAES;
exports.encryptAESCTR = encryptAESCTR;
exports.decryptRSA = decryptRSA;
exports.decryptAES = decryptAES;
exports.generateAESKey = generateAESKey;
exports.generateAESCTRKey = generateAESCTRKey;
exports.generateRSAKey = generateRSAKey;
exports.exportJWKKey = exportJWKKey;
exports.importRSAKey = importRSAKey;
exports.importAESKey = importAESKey;
exports.importRawKey = importRawKey;
exports.deriveKey = deriveKey;
exports.readFileAsArrayBuffer = readFileAsArrayBuffer;
exports.generateMnemonicPhrase = generateMnemonicPhrase;
exports.createSha256HashFromText = createSha256HashFromText;
exports.sha256HashFromArrayBuffer = sha256HashFromArrayBuffer;
const random_1 = require("@rocket.chat/random");
const bytebuffer_1 = __importDefault(require("bytebuffer"));
function toString(thing) {
    if (typeof thing === 'string') {
        return thing;
    }
    return bytebuffer_1.default.wrap(thing).toString('binary');
}
function toArrayBuffer(thing) {
    if (thing === undefined) {
        return undefined;
    }
    if (typeof thing === 'object') {
        if (Object.getPrototypeOf(thing) === ArrayBuffer.prototype) {
            return thing;
        }
    }
    if (typeof thing !== 'string') {
        throw new Error(`Tried to convert a non-string of type ${typeof thing} to an array buffer`);
    }
    return bytebuffer_1.default.wrap(thing, 'binary').toArrayBuffer();
}
function joinVectorAndEcryptedData(vector, encryptedData) {
    const cipherText = new Uint8Array(encryptedData);
    const output = new Uint8Array(vector.length + cipherText.length);
    output.set(vector, 0);
    output.set(cipherText, vector.length);
    return output;
}
function splitVectorAndEcryptedData(cipherText) {
    const vector = cipherText.slice(0, 16);
    const encryptedData = cipherText.slice(16);
    return [vector, encryptedData];
}
function encryptRSA(key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, data);
    });
}
function encryptAES(vector, key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto.subtle.encrypt({ name: 'AES-CBC', iv: vector }, key, data);
    });
}
function encryptAESCTR(vector, key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto.subtle.encrypt({ name: 'AES-CTR', counter: vector, length: 64 }, key, data);
    });
}
function decryptRSA(key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, data);
    });
}
function decryptAES(vector, key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto.subtle.decrypt({ name: 'AES-CBC', iv: vector }, key, data);
    });
}
function generateAESKey() {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto.subtle.generateKey({ name: 'AES-CBC', length: 128 }, true, ['encrypt', 'decrypt']);
    });
}
function generateAESCTRKey() {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto.subtle.generateKey({ name: 'AES-CTR', length: 256 }, true, ['encrypt', 'decrypt']);
    });
}
function generateRSAKey() {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto.subtle.generateKey({
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: 'SHA-256' },
        }, true, ['encrypt', 'decrypt']);
    });
}
function exportJWKKey(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto.subtle.exportKey('jwk', key);
    });
}
function importRSAKey(keyData_1) {
    return __awaiter(this, arguments, void 0, function* (keyData, keyUsages = ['encrypt', 'decrypt']) {
        return crypto.subtle.importKey('jwk', keyData, {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: 'SHA-256' },
        }, true, keyUsages);
    });
}
function importAESKey(keyData_1) {
    return __awaiter(this, arguments, void 0, function* (keyData, keyUsages = ['encrypt', 'decrypt']) {
        return crypto.subtle.importKey('jwk', keyData, { name: 'AES-CBC' }, true, keyUsages);
    });
}
function importRawKey(keyData_1) {
    return __awaiter(this, arguments, void 0, function* (keyData, keyUsages = ['deriveKey']) {
        return crypto.subtle.importKey('raw', keyData, { name: 'PBKDF2' }, false, keyUsages);
    });
}
function deriveKey(salt_1, baseKey_1) {
    return __awaiter(this, arguments, void 0, function* (salt, baseKey, keyUsages = ['encrypt', 'decrypt']) {
        const iterations = 1000;
        const hash = 'SHA-256';
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash }, baseKey, { name: 'AES-CBC', length: 256 }, true, keyUsages);
    });
}
function readFileAsArrayBuffer(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                var _a;
                resolve((_a = evt.target) === null || _a === void 0 ? void 0 : _a.result);
            };
            reader.onerror = (evt) => {
                reject(evt);
            };
            reader.readAsArrayBuffer(file);
        });
    });
}
function generateMnemonicPhrase(n_1) {
    return __awaiter(this, arguments, void 0, function* (n, sep = ' ') {
        const { default: wordList } = yield Promise.resolve().then(() => __importStar(require('./wordList')));
        const result = new Array(n);
        let len = wordList.length;
        const taken = new Array(len);
        while (n--) {
            const x = Math.floor(random_1.Random.fraction() * len);
            result[n] = wordList[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result.join(sep);
    });
}
function createSha256HashFromText(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
        return Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    });
}
function sha256HashFromArrayBuffer(arrayBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashArray = Array.from(new Uint8Array(yield crypto.subtle.digest('SHA-256', arrayBuffer)));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    });
}
