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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = slashCommandHandler;
exports.handleExecutor = handleExecutor;
exports.handlePreviewItem = handlePreviewItem;
const jsonrpc_lite_1 = require("jsonrpc-lite");
const AppObjectRegistry_ts_1 = require("../AppObjectRegistry.ts");
const mod_ts_1 = require("../lib/accessors/mod.ts");
const require_ts_1 = require("../lib/require.ts");
const roomFactory_ts_1 = __importDefault(require("../lib/roomFactory.ts"));
// For some reason Deno couldn't understand the typecast to the original interfaces and said it wasn't a constructor type
const { SlashCommandContext } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/slashcommands/SlashCommandContext.js');
function slashCommandHandler(call, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [, commandName, method] = call.split(':');
        const command = AppObjectRegistry_ts_1.AppObjectRegistry.get(`slashcommand:${commandName}`);
        if (!command) {
            return new jsonrpc_lite_1.JsonRpcError(`Slashcommand ${commandName} not found`, -32000);
        }
        let result;
        // If the command is registered, we're pretty safe to assume the app is not undefined
        const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
        app.getLogger().debug(`${commandName}'s ${method} is being executed...`, params);
        try {
            if (method === 'executor' || method === 'previewer') {
                result = yield handleExecutor({ AppAccessorsInstance: mod_ts_1.AppAccessorsInstance }, command, method, params);
            }
            else if (method === 'executePreviewItem') {
                result = yield handlePreviewItem({ AppAccessorsInstance: mod_ts_1.AppAccessorsInstance }, command, params);
            }
            else {
                return new jsonrpc_lite_1.JsonRpcError(`Method ${method} not found on slashcommand ${commandName}`, -32000);
            }
            app.getLogger().debug(`${commandName}'s ${method} was successfully executed.`);
        }
        catch (error) {
            app.getLogger().debug(`${commandName}'s ${method} was unsuccessful.`);
            return new jsonrpc_lite_1.JsonRpcError(error.message, -32000);
        }
        return result;
    });
}
/**
 * @param deps Dependencies that need to be injected into the slashcommand
 * @param command The slashcommand that is being executed
 * @param method The method that is being executed
 * @param params The parameters that are being passed to the method
 */
function handleExecutor(deps, command, method, params) {
    const executor = command[method];
    if (typeof executor !== 'function') {
        throw new Error(`Method ${method} not found on slashcommand ${command.command}`);
    }
    if (!Array.isArray(params) || typeof params[0] !== 'object' || !params[0]) {
        throw new Error(`First parameter must be an object`);
    }
    const { sender, room, params: args, threadId, triggerId } = params[0];
    const context = new SlashCommandContext(sender, (0, roomFactory_ts_1.default)(room, deps.AppAccessorsInstance.getSenderFn()), args, threadId, triggerId);
    return executor.apply(command, [
        context,
        deps.AppAccessorsInstance.getReader(),
        deps.AppAccessorsInstance.getModifier(),
        deps.AppAccessorsInstance.getHttp(),
        deps.AppAccessorsInstance.getPersistence(),
    ]);
}
/**
 * @param deps Dependencies that need to be injected into the slashcommand
 * @param command The slashcommand that is being executed
 * @param params The parameters that are being passed to the method
 */
function handlePreviewItem(deps, command, params) {
    if (typeof command.executePreviewItem !== 'function') {
        throw new Error(`Method  not found on slashcommand ${command.command}`);
    }
    if (!Array.isArray(params) || typeof params[0] !== 'object' || !params[0]) {
        throw new Error(`First parameter must be an object`);
    }
    const [previewItem, { sender, room, params: args, threadId, triggerId }] = params;
    const context = new SlashCommandContext(sender, (0, roomFactory_ts_1.default)(room, deps.AppAccessorsInstance.getSenderFn()), args, threadId, triggerId);
    return command.executePreviewItem(previewItem, context, deps.AppAccessorsInstance.getReader(), deps.AppAccessorsInstance.getModifier(), deps.AppAccessorsInstance.getHttp(), deps.AppAccessorsInstance.getPersistence());
}
