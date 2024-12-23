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
exports.default = apiHandler;
const jsonrpc_lite_1 = require("jsonrpc-lite");
const AppObjectRegistry_ts_1 = require("../AppObjectRegistry.ts");
const mod_ts_1 = require("../lib/accessors/mod.ts");
function apiHandler(call, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [, path, httpMethod] = call.split(':');
        const endpoint = AppObjectRegistry_ts_1.AppObjectRegistry.get(`api:${path}`);
        const logger = AppObjectRegistry_ts_1.AppObjectRegistry.get('logger');
        if (!endpoint) {
            return new jsonrpc_lite_1.JsonRpcError(`Endpoint ${path} not found`, -32000);
        }
        const method = endpoint[httpMethod];
        if (typeof method !== 'function') {
            return new jsonrpc_lite_1.JsonRpcError(`${path}'s ${httpMethod} not exists`, -32000);
        }
        const [request, endpointInfo] = params;
        logger === null || logger === void 0 ? void 0 : logger.debug(`${path}'s ${call} is being executed...`, request);
        try {
            // deno-lint-ignore ban-types
            const result = yield method.apply(endpoint, [
                request,
                endpointInfo,
                mod_ts_1.AppAccessorsInstance.getReader(),
                mod_ts_1.AppAccessorsInstance.getModifier(),
                mod_ts_1.AppAccessorsInstance.getHttp(),
                mod_ts_1.AppAccessorsInstance.getPersistence(),
            ]);
            logger === null || logger === void 0 ? void 0 : logger.debug(`${path}'s ${call} was successfully executed.`);
            return result;
        }
        catch (e) {
            logger === null || logger === void 0 ? void 0 : logger.debug(`${path}'s ${call} was unsuccessful.`);
            return new jsonrpc_lite_1.JsonRpcError(e.message || "Internal server error", -32000);
        }
    });
}
