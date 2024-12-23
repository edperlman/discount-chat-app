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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = videoConferenceHandler;
const jsonrpc_lite_1 = require("jsonrpc-lite");
const AppObjectRegistry_ts_1 = require("../AppObjectRegistry.ts");
const mod_ts_1 = require("../lib/accessors/mod.ts");
function videoConferenceHandler(call, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [, providerName, methodName] = call.split(':');
        const provider = AppObjectRegistry_ts_1.AppObjectRegistry.get(`videoConfProvider:${providerName}`);
        const logger = AppObjectRegistry_ts_1.AppObjectRegistry.get('logger');
        if (!provider) {
            return new jsonrpc_lite_1.JsonRpcError(`Provider ${providerName} not found`, -32000);
        }
        const method = provider[methodName];
        if (typeof method !== 'function') {
            return jsonrpc_lite_1.JsonRpcError.methodNotFound({
                message: `Method ${methodName} not found on provider ${providerName}`,
            });
        }
        const [videoconf, user, options] = params;
        logger === null || logger === void 0 ? void 0 : logger.debug(`Executing ${methodName} on video conference provider...`);
        const args = [...(videoconf ? [videoconf] : []), ...(user ? [user] : []), ...(options ? [options] : [])];
        try {
            // deno-lint-ignore ban-types
            const result = yield method.apply(provider, [
                ...args,
                mod_ts_1.AppAccessorsInstance.getReader(),
                mod_ts_1.AppAccessorsInstance.getModifier(),
                mod_ts_1.AppAccessorsInstance.getHttp(),
                mod_ts_1.AppAccessorsInstance.getPersistence(),
            ]);
            logger === null || logger === void 0 ? void 0 : logger.debug(`Video Conference Provider's ${methodName} was successfully executed.`);
            return result;
        }
        catch (e) {
            logger === null || logger === void 0 ? void 0 : logger.debug(`Video Conference Provider's ${methodName} was unsuccessful.`);
            return new jsonrpc_lite_1.JsonRpcError(e.message, -32000);
        }
    });
}
