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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSignatureManager = void 0;
const crypto_1 = require("crypto");
const jose = __importStar(require("jose"));
class AppSignatureManager {
    constructor(manager) {
        this.manager = manager;
        this.checksumAlgorithm = 'SHA256';
        this.signingAlgorithm = 'RS512';
        this.federationBridge = this.manager.getBridges().getInternalFederationBridge();
    }
    verifySignedApp(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicKey = yield jose.importSPKI(yield this.getPublicKey(), 'pem');
            const { payload } = yield jose.jwtVerify(app.signature, publicKey);
            const checksum = this.calculateChecksumForApp(app);
            if (payload.checksum !== checksum) {
                throw new Error('Invalid checksum');
            }
        });
    }
    signApp(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const checksum = this.calculateChecksumForApp(app);
            const privateKey = yield jose.importPKCS8(yield this.getPrivateKey(), this.signingAlgorithm);
            const signature = yield new jose.SignJWT({ checksum, calg: this.checksumAlgorithm })
                .setProtectedHeader({ alg: this.signingAlgorithm })
                .setIssuedAt()
                .sign(privateKey);
            return signature;
        });
    }
    getPrivateKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.privateKey) {
                this.privateKey = yield this.federationBridge.getPrivateKey();
            }
            return this.privateKey;
        });
    }
    getPublicKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.publicKey) {
                this.publicKey = yield this.federationBridge.getPublicKey();
            }
            return this.publicKey;
        });
    }
    calculateChecksumForApp(app, alg = this.checksumAlgorithm) {
        return (0, crypto_1.createHash)(alg).update(this.getFieldsForChecksum(app)).digest('hex');
    }
    getFieldsForChecksum(obj) {
        // These fields don't hold valuable information and should NOT invalidate
        // the checksum
        const fieldsToIgnore = ['_id', 'status', 'signature', 'updatedAt', 'createdAt', '_updatedAt', '_createdAt', 'settings'];
        // TODO revisit algorithm
        const allKeys = [];
        const seen = {};
        JSON.stringify(obj, (key, value) => {
            if (!(key in seen)) {
                allKeys.push(key);
                seen[key] = null;
            }
            return value;
        });
        const filteredKeys = allKeys.sort().filter((key) => !fieldsToIgnore.includes(key));
        return JSON.stringify(obj, filteredKeys);
    }
}
exports.AppSignatureManager = AppSignatureManager;
