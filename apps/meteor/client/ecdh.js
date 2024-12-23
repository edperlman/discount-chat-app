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
const meteor_1 = require("meteor/meteor");
const SDKClient_1 = require("../app/utils/client/lib/SDKClient");
let resolveSession;
const sessionPromise = new Promise((resolve) => {
    resolveSession = resolve;
});
function init(session) {
    meteor_1.Meteor.connection._stream.allowConnection();
    const _didMessage = meteor_1.Meteor.connection._stream.socket._didMessage.bind(meteor_1.Meteor.connection._stream.socket);
    const send = meteor_1.Meteor.connection._stream.socket.send.bind(meteor_1.Meteor.connection._stream.socket);
    meteor_1.Meteor.connection._stream.socket._didMessage = (data) => __awaiter(this, void 0, void 0, function* () {
        const decryptedData = yield session.decrypt(data);
        decryptedData.split('\n').forEach((d) => _didMessage(d));
    });
    meteor_1.Meteor.connection._stream.socket.send = (data) => __awaiter(this, void 0, void 0, function* () {
        send(yield session.encrypt(data));
    });
}
function initEncryptedSession() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!window.ECDH_Enabled) {
            meteor_1.Meteor.connection._stream.allowConnection();
            return resolveSession();
        }
        const { ClientSession } = yield Promise.resolve().then(() => __importStar(require('../app/ecdh/client/ClientSession')));
        const session = new ClientSession();
        const clientPublicKey = yield session.init();
        try {
            const response = yield fetch('/api/ecdh_proxy/initEncryptedSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientPublicKey }),
            });
            if (response.status !== 200) {
                resolveSession();
                return meteor_1.Meteor.connection._stream.allowConnection();
            }
            const data = yield response.json();
            if (data.success === false) {
                resolveSession();
                return meteor_1.Meteor.connection._stream.allowConnection();
            }
            yield session.setServerKey(data.publicKeyString);
            resolveSession(session);
            init(session);
        }
        catch (e) {
            console.log(e);
            resolveSession();
            meteor_1.Meteor.connection._stream.allowConnection();
        }
    });
}
initEncryptedSession();
SDKClient_1.sdk.rest.use((request, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield sessionPromise;
    if (!session) {
        return next(...request);
    }
    const result = yield (yield next(...request)).text();
    const decrypted = yield session.decrypt(result);
    const parsed = JSON.parse(decrypted);
    return parsed;
}));
