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
exports.Transport = exports.Queue = exports.RPCResponseObserver = void 0;
exports.isRequest = isRequest;
exports.isResponse = isResponse;
exports.isErrorResponse = isErrorResponse;
exports.parseMessage = parseMessage;
exports.sendInvalidRequestError = sendInvalidRequestError;
exports.sendInvalidParamsError = sendInvalidParamsError;
exports.sendParseError = sendParseError;
exports.sendMethodNotFound = sendMethodNotFound;
exports.errorResponse = errorResponse;
exports.successResponse = successResponse;
exports.pongResponse = pongResponse;
exports.sendRequest = sendRequest;
exports.sendNotification = sendNotification;
exports.log = log;
const write_all_ts_1 = require("https://deno.land/std@0.216.0/io/write_all.ts");
const jsonrpc = __importStar(require("jsonrpc-lite"));
const AppObjectRegistry_ts_1 = require("../AppObjectRegistry.ts");
const codec_ts_1 = require("./codec.ts");
function isRequest(message) {
    return message.type === 'request' || message.type === 'notification';
}
function isResponse(message) {
    return message.type === 'success' || message.type === 'error';
}
function isErrorResponse(message) {
    return message instanceof jsonrpc.ErrorObject;
}
const COMMAND_PONG = '_zPONG';
exports.RPCResponseObserver = new EventTarget();
exports.Queue = new (class Queue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }
    processQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isProcessing) {
                return;
            }
            this.isProcessing = true;
            while (this.queue.length) {
                const message = this.queue.shift();
                if (message) {
                    yield exports.Transport.send(message);
                }
            }
            this.isProcessing = false;
        });
    }
    enqueue(message) {
        this.queue.push(codec_ts_1.encoder.encode(message));
        this.processQueue();
    }
});
exports.Transport = new (class Transporter {
    constructor() {
        this.selectedTransport = this.stdoutTransport.bind(this);
    }
    stdoutTransport(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, write_all_ts_1.writeAll)(Deno.stdout, message);
        });
    }
    noopTransport(_message) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    selectTransport(transport) {
        switch (transport) {
            case 'stdout':
                this.selectedTransport = this.stdoutTransport.bind(this);
                break;
            case 'noop':
                this.selectedTransport = this.noopTransport.bind(this);
                break;
        }
    }
    send(message) {
        return this.selectedTransport(message);
    }
})();
function parseMessage(message) {
    let parsed;
    if (typeof message === 'string') {
        parsed = jsonrpc.parse(message);
    }
    else {
        parsed = jsonrpc.parseObject(message);
    }
    if (Array.isArray(parsed)) {
        throw jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest(null));
    }
    if (parsed.type === 'invalid') {
        throw jsonrpc.error(null, parsed.payload);
    }
    return parsed;
}
function sendInvalidRequestError() {
    return __awaiter(this, void 0, void 0, function* () {
        const rpc = jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest(null));
        yield exports.Queue.enqueue(rpc);
    });
}
function sendInvalidParamsError(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const rpc = jsonrpc.error(id, jsonrpc.JsonRpcError.invalidParams(null));
        yield exports.Queue.enqueue(rpc);
    });
}
function sendParseError() {
    return __awaiter(this, void 0, void 0, function* () {
        const rpc = jsonrpc.error(null, jsonrpc.JsonRpcError.parseError(null));
        yield exports.Queue.enqueue(rpc);
    });
}
function sendMethodNotFound(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const rpc = jsonrpc.error(id, jsonrpc.JsonRpcError.methodNotFound(null));
        yield exports.Queue.enqueue(rpc);
    });
}
function errorResponse(_a) {
    return __awaiter(this, arguments, void 0, function* ({ error: { message, code = -32000, data = {} }, id }) {
        const logger = AppObjectRegistry_ts_1.AppObjectRegistry.get('logger');
        if (logger === null || logger === void 0 ? void 0 : logger.hasEntries()) {
            data.logs = logger.getLogs();
        }
        const rpc = jsonrpc.error(id, new jsonrpc.JsonRpcError(message, code, data));
        yield exports.Queue.enqueue(rpc);
    });
}
function successResponse(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, result }) {
        const payload = { value: result };
        const logger = AppObjectRegistry_ts_1.AppObjectRegistry.get('logger');
        if (logger === null || logger === void 0 ? void 0 : logger.hasEntries()) {
            payload.logs = logger.getLogs();
        }
        const rpc = jsonrpc.success(id, payload);
        yield exports.Queue.enqueue(rpc);
    });
}
function pongResponse() {
    return Promise.resolve(exports.Queue.enqueue(COMMAND_PONG));
}
function sendRequest(requestDescriptor) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = jsonrpc.request(Math.random().toString(36).slice(2), requestDescriptor.method, requestDescriptor.params);
        // TODO: add timeout to this
        const responsePromise = new Promise((resolve, reject) => {
            const handler = (event) => {
                if (event instanceof ErrorEvent) {
                    reject(event.error);
                }
                if (event instanceof CustomEvent) {
                    resolve(event.detail);
                }
                exports.RPCResponseObserver.removeEventListener(`response:${request.id}`, handler);
            };
            exports.RPCResponseObserver.addEventListener(`response:${request.id}`, handler);
        });
        yield exports.Queue.enqueue(request);
        return responsePromise;
    });
}
function sendNotification({ method, params }) {
    const request = jsonrpc.notification(method, params);
    exports.Queue.enqueue(request);
}
function log(params) {
    sendNotification({ method: 'log', params });
}
