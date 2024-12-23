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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (!Deno.args.includes('--subprocess')) {
    Deno.stderr.writeSync(new TextEncoder().encode(`
            This is a Deno wrapper for Rocket.Chat Apps. It is not meant to be executed stand-alone;
            It is instead meant to be executed as a subprocess by the Apps-Engine framework.
       `));
    Deno.exit(1001);
}
const jsonrpc_lite_1 = require("jsonrpc-lite");
const Messenger = __importStar(require("./lib/messenger.ts"));
const codec_ts_1 = require("./lib/codec.ts");
const AppObjectRegistry_ts_1 = require("./AppObjectRegistry.ts");
const logger_ts_1 = require("./lib/logger.ts");
const slashcommand_handler_ts_1 = __importDefault(require("./handlers/slashcommand-handler.ts"));
const videoconference_handler_ts_1 = __importDefault(require("./handlers/videoconference-handler.ts"));
const api_handler_ts_1 = __importDefault(require("./handlers/api-handler.ts"));
const handler_ts_1 = __importDefault(require("./handlers/app/handler.ts"));
const scheduler_handler_ts_1 = __importDefault(require("./handlers/scheduler-handler.ts"));
const error_handlers_ts_1 = __importDefault(require("./error-handlers.ts"));
const COMMAND_PING = '_zPING';
function requestRouter(_a) {
    return __awaiter(this, arguments, void 0, function* ({ type, payload }) {
        const methodHandlers = {
            app: handler_ts_1.default,
            api: api_handler_ts_1.default,
            slashcommand: slashcommand_handler_ts_1.default,
            videoconference: videoconference_handler_ts_1.default,
            scheduler: scheduler_handler_ts_1.default,
            ping: (_method, _params) => 'pong',
        };
        // We're not handling notifications at the moment
        if (type === 'notification') {
            return Messenger.sendInvalidRequestError();
        }
        const { id, method, params } = payload;
        const logger = new logger_ts_1.Logger(method);
        AppObjectRegistry_ts_1.AppObjectRegistry.set('logger', logger);
        const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
        if (app) {
            // Same logic as applied in the ProxiedApp class previously
            app.logger = logger;
        }
        const [methodPrefix] = method.split(':');
        const handler = methodHandlers[methodPrefix];
        if (!handler) {
            return Messenger.errorResponse({
                error: { message: 'Method not found', code: -32601 },
                id,
            });
        }
        const result = yield handler(method, params);
        if (result instanceof jsonrpc_lite_1.JsonRpcError) {
            return Messenger.errorResponse({ id, error: result });
        }
        return Messenger.successResponse({ id, result });
    });
}
function handleResponse(response) {
    let event;
    if (response.type === 'error') {
        event = new ErrorEvent(`response:${response.payload.id}`, {
            error: response.payload,
        });
    }
    else {
        event = new CustomEvent(`response:${response.payload.id}`, {
            detail: response.payload,
        });
    }
    Messenger.RPCResponseObserver.dispatchEvent(event);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        Messenger.sendNotification({ method: 'ready' });
        try {
            for (var _d = true, _e = __asyncValues(codec_ts_1.decoder.decodeStream(Deno.stdin.readable)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const message = _c;
                try {
                    // Process PING command first as it is not JSON RPC
                    if (message === COMMAND_PING) {
                        Messenger.pongResponse();
                        continue;
                    }
                    const JSONRPCMessage = Messenger.parseMessage(message);
                    if (Messenger.isRequest(JSONRPCMessage)) {
                        void requestRouter(JSONRPCMessage);
                        continue;
                    }
                    if (Messenger.isResponse(JSONRPCMessage)) {
                        handleResponse(JSONRPCMessage);
                    }
                }
                catch (error) {
                    if (Messenger.isErrorResponse(error)) {
                        yield Messenger.errorResponse(error);
                    }
                    else {
                        yield Messenger.sendParseError();
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
(0, error_handlers_ts_1.default)();
main();
