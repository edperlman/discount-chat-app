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
exports.buildSandbox = void 0;
const events_1 = require("events");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const isolated_vm_1 = __importDefault(require("isolated-vm"));
const s = __importStar(require("../../../../../lib/utils/stringUtils"));
const proxyObject = (obj, forbiddenKeys = []) => {
    return copyObject({
        isProxy: true,
        get: (key) => {
            if (forbiddenKeys.includes(key)) {
                return undefined;
            }
            const value = obj[key];
            if (typeof value === 'function') {
                return new isolated_vm_1.default.Reference((...args) => __awaiter(void 0, void 0, void 0, function* () {
                    const result = obj[key](...args);
                    if (result && result instanceof Promise) {
                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                            try {
                                const awaitedResult = yield result;
                                resolve(makeTransferable(awaitedResult));
                            }
                            catch (e) {
                                reject(e);
                            }
                        }));
                    }
                    return makeTransferable(result);
                }));
            }
            return makeTransferable(value);
        },
    });
};
const copyObject = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map((data) => copyData(data));
    }
    if (obj instanceof server_fetch_1.Response) {
        return proxyObject(obj, ['clone']);
    }
    if (isSemiTransferable(obj)) {
        return obj;
    }
    if (typeof obj[Symbol.iterator] === 'function') {
        return copyObject(Array.from(obj));
    }
    if (obj instanceof events_1.EventEmitter) {
        return {};
    }
    const keys = Object.keys(obj);
    return Object.assign({}, Object.fromEntries(keys.map((key) => {
        const data = obj[key];
        if (typeof data === 'function') {
            return [key, new isolated_vm_1.default.Callback((...args) => obj[key](...args))];
        }
        return [key, copyData(data)];
    })));
};
// Transferable data can be passed to isolates directly
const isTransferable = (data) => {
    const dataType = typeof data;
    if (data === isolated_vm_1.default) {
        return true;
    }
    if (['null', 'undefined', 'string', 'number', 'boolean', 'function'].includes(dataType)) {
        return true;
    }
    if (dataType !== 'object') {
        return false;
    }
    return (data instanceof isolated_vm_1.default.Isolate ||
        data instanceof isolated_vm_1.default.Context ||
        data instanceof isolated_vm_1.default.Script ||
        data instanceof isolated_vm_1.default.ExternalCopy ||
        data instanceof isolated_vm_1.default.Callback ||
        data instanceof isolated_vm_1.default.Reference);
};
// Semi-transferable data can be copied with an ivm.ExternalCopy without needing any manipulation.
const isSemiTransferable = (data) => data instanceof ArrayBuffer;
const copyData = (data) => (isTransferable(data) ? data : copyObject(data));
const makeTransferable = (data) => (isTransferable(data) ? data : new isolated_vm_1.default.ExternalCopy(copyObject(data)).copyInto());
const buildSandbox = (context) => {
    const { global: jail } = context;
    jail.setSync('global', jail.derefInto());
    jail.setSync('ivm', isolated_vm_1.default);
    jail.setSync('s', makeTransferable(s));
    jail.setSync('console', makeTransferable(console));
    jail.setSync('serverFetch', new isolated_vm_1.default.Reference((url, ...args) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, server_fetch_1.serverFetch)(url, ...args);
        return makeTransferable(result);
    })));
};
exports.buildSandbox = buildSandbox;
