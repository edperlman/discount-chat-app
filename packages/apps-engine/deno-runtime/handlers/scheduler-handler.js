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
exports.default = handleScheduler;
const jsonrpc_lite_1 = require("jsonrpc-lite");
const AppObjectRegistry_ts_1 = require("../AppObjectRegistry.ts");
const mod_ts_1 = require("../lib/accessors/mod.ts");
function handleScheduler(method, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [, processorId] = method.split(':');
        if (!Array.isArray(params)) {
            return jsonrpc_lite_1.JsonRpcError.invalidParams({ message: 'Invalid params' });
        }
        const [context] = params;
        const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
        if (!app) {
            return jsonrpc_lite_1.JsonRpcError.internalError({ message: 'App not found' });
        }
        // AppSchedulerManager will append the appId to the processor name to avoid conflicts
        const processor = AppObjectRegistry_ts_1.AppObjectRegistry.get(`scheduler:${processorId}`);
        if (!processor) {
            return jsonrpc_lite_1.JsonRpcError.methodNotFound({
                message: `Could not find processor for method ${method}`,
            });
        }
        app.getLogger().debug(`Job processor ${processor.id} is being executed...`);
        try {
            yield processor.processor(context, mod_ts_1.AppAccessorsInstance.getReader(), mod_ts_1.AppAccessorsInstance.getModifier(), mod_ts_1.AppAccessorsInstance.getHttp(), mod_ts_1.AppAccessorsInstance.getPersistence());
            app.getLogger().debug(`Job processor ${processor.id} was successfully executed`);
            return null;
        }
        catch (e) {
            app.getLogger().error(e);
            app.getLogger().error(`Job processor ${processor.id} was unsuccessful`);
            return jsonrpc_lite_1.JsonRpcError.internalError({ message: e.message });
        }
    });
}
