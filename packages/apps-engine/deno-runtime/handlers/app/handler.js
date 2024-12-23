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
exports.default = handleApp;
const jsonrpc_lite_1 = require("jsonrpc-lite");
const construct_ts_1 = __importDefault(require("./construct.ts"));
const handleInitialize_ts_1 = __importDefault(require("./handleInitialize.ts"));
const handleGetStatus_ts_1 = __importDefault(require("./handleGetStatus.ts"));
const handleSetStatus_ts_1 = __importDefault(require("./handleSetStatus.ts"));
const handleOnEnable_ts_1 = __importDefault(require("./handleOnEnable.ts"));
const handleOnInstall_ts_1 = __importDefault(require("./handleOnInstall.ts"));
const handleOnDisable_ts_1 = __importDefault(require("./handleOnDisable.ts"));
const handleOnUninstall_ts_1 = __importDefault(require("./handleOnUninstall.ts"));
const handleOnPreSettingUpdate_ts_1 = __importDefault(require("./handleOnPreSettingUpdate.ts"));
const handleOnSettingUpdated_ts_1 = __importDefault(require("./handleOnSettingUpdated.ts"));
const handler_ts_1 = __importDefault(require("../listener/handler.ts"));
const handler_ts_2 = __importStar(require("../uikit/handler.ts"));
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const handleOnUpdate_ts_1 = __importDefault(require("./handleOnUpdate.ts"));
function handleApp(method, params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const [, appMethod] = method.split(':');
        // We don't want the getStatus method to generate logs, so we handle it separately
        if (appMethod === 'getStatus') {
            return (0, handleGetStatus_ts_1.default)();
        }
        // `app` will be undefined if the method here is "app:construct"
        const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
        app === null || app === void 0 ? void 0 : app.getLogger().debug(`'${appMethod}' is being called...`);
        if (handler_ts_2.uikitInteractions.includes(appMethod)) {
            return (0, handler_ts_2.default)(appMethod, params).then((result) => {
                if (result instanceof jsonrpc_lite_1.JsonRpcError) {
                    app === null || app === void 0 ? void 0 : app.getLogger().debug(`'${appMethod}' was unsuccessful.`, result.message);
                }
                else {
                    app === null || app === void 0 ? void 0 : app.getLogger().debug(`'${appMethod}' was successfully called! The result is:`, result);
                }
                return result;
            });
        }
        if (appMethod.startsWith('check') || appMethod.startsWith('execute')) {
            return (0, handler_ts_1.default)(appMethod, params).then((result) => {
                if (result instanceof jsonrpc_lite_1.JsonRpcError) {
                    app === null || app === void 0 ? void 0 : app.getLogger().debug(`'${appMethod}' was unsuccessful.`, result.message);
                }
                else {
                    app === null || app === void 0 ? void 0 : app.getLogger().debug(`'${appMethod}' was successfully called! The result is:`, result);
                }
                return result;
            });
        }
        try {
            let result;
            switch (appMethod) {
                case 'construct':
                    result = yield (0, construct_ts_1.default)(params);
                    break;
                case 'initialize':
                    result = yield (0, handleInitialize_ts_1.default)();
                    break;
                case 'setStatus':
                    result = yield (0, handleSetStatus_ts_1.default)(params);
                    break;
                case 'onEnable':
                    result = yield (0, handleOnEnable_ts_1.default)();
                    break;
                case 'onDisable':
                    result = yield (0, handleOnDisable_ts_1.default)();
                    break;
                case 'onInstall':
                    result = yield (0, handleOnInstall_ts_1.default)(params);
                    break;
                case 'onUninstall':
                    result = yield (0, handleOnUninstall_ts_1.default)(params);
                    break;
                case 'onPreSettingUpdate':
                    result = yield (0, handleOnPreSettingUpdate_ts_1.default)(params);
                    break;
                case 'onSettingUpdated':
                    result = yield (0, handleOnSettingUpdated_ts_1.default)(params);
                    break;
                case 'onUpdate':
                    result = yield (0, handleOnUpdate_ts_1.default)(params);
                    break;
                default:
                    throw new jsonrpc_lite_1.JsonRpcError('Method not found', -32601);
            }
            app === null || app === void 0 ? void 0 : app.getLogger().debug(`'${appMethod}' was successfully called! The result is:`, result);
            return result;
        }
        catch (e) {
            if (!(e instanceof Error)) {
                return new jsonrpc_lite_1.JsonRpcError('Unknown error', -32000, e);
            }
            if ((_a = e.cause) === null || _a === void 0 ? void 0 : _a.includes('invalid_param_type')) {
                return jsonrpc_lite_1.JsonRpcError.invalidParams(null);
            }
            if ((_b = e.cause) === null || _b === void 0 ? void 0 : _b.includes('invalid_app')) {
                return jsonrpc_lite_1.JsonRpcError.internalError({ message: 'App unavailable' });
            }
            return new jsonrpc_lite_1.JsonRpcError(e.message, -32000, e);
        }
    });
}
