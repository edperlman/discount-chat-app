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
exports.default = handleListener;
exports.parseArgs = parseArgs;
const jsonrpc_lite_1 = require("jsonrpc-lite");
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const MessageExtender_ts_1 = require("../../lib/accessors/extenders/MessageExtender.ts");
const RoomExtender_ts_1 = require("../../lib/accessors/extenders/RoomExtender.ts");
const MessageBuilder_ts_1 = require("../../lib/accessors/builders/MessageBuilder.ts");
const RoomBuilder_ts_1 = require("../../lib/accessors/builders/RoomBuilder.ts");
const mod_ts_1 = require("../../lib/accessors/mod.ts");
const require_ts_1 = require("../../lib/require.ts");
const roomFactory_ts_1 = __importDefault(require("../../lib/roomFactory.ts"));
const room_ts_1 = require("../../lib/room.ts");
const { AppsEngineException } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/exceptions/AppsEngineException.js');
function handleListener(evtInterface, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
        const eventExecutor = app === null || app === void 0 ? void 0 : app[evtInterface];
        if (typeof eventExecutor !== 'function') {
            return jsonrpc_lite_1.JsonRpcError.methodNotFound({
                message: 'Invalid event interface called on app',
            });
        }
        if (!Array.isArray(params) || params.length < 1 || params.length > 2) {
            return jsonrpc_lite_1.JsonRpcError.invalidParams(null);
        }
        try {
            const args = parseArgs({ AppAccessorsInstance: mod_ts_1.AppAccessorsInstance }, evtInterface, params);
            return yield eventExecutor.apply(app, args);
        }
        catch (e) {
            if (e instanceof jsonrpc_lite_1.JsonRpcError) {
                return e;
            }
            if (e instanceof AppsEngineException) {
                return new jsonrpc_lite_1.JsonRpcError(e.message, AppsEngineException.JSONRPC_ERROR_CODE, { name: e.name });
            }
            return jsonrpc_lite_1.JsonRpcError.internalError({ message: e.message });
        }
    });
}
function parseArgs(deps, evtMethod, params) {
    const { AppAccessorsInstance } = deps;
    /**
     * param1 is the context for the event handler execution
     * param2 is an optional extra content that some hanlers require
     */
    const [param1, param2] = params;
    if (!param1) {
        throw jsonrpc_lite_1.JsonRpcError.invalidParams(null);
    }
    let context = param1;
    if (evtMethod.includes('Message')) {
        context = hydrateMessageObjects(context);
    }
    else if (evtMethod.endsWith('RoomUserJoined') || evtMethod.endsWith('RoomUserLeave')) {
        context.room = (0, roomFactory_ts_1.default)(context.room, AppAccessorsInstance.getSenderFn());
    }
    else if (evtMethod.includes('PreRoom')) {
        context = (0, roomFactory_ts_1.default)(context, AppAccessorsInstance.getSenderFn());
    }
    const args = [context, AppAccessorsInstance.getReader(), AppAccessorsInstance.getHttp()];
    // "check" events will only go this far - (context, reader, http)
    if (evtMethod.startsWith('check')) {
        // "checkPostMessageDeleted" has an extra param - (context, reader, http, extraContext)
        if (param2) {
            args.push(hydrateMessageObjects(param2));
        }
        return args;
    }
    // From this point on, all events will require (reader, http, persistence) injected
    args.push(AppAccessorsInstance.getPersistence());
    // "extend" events have an additional "Extender" param - (context, extender, reader, http, persistence)
    if (evtMethod.endsWith('Extend')) {
        if (evtMethod.includes('Message')) {
            args.splice(1, 0, new MessageExtender_ts_1.MessageExtender(param1));
        }
        else if (evtMethod.includes('Room')) {
            args.splice(1, 0, new RoomExtender_ts_1.RoomExtender(param1));
        }
        return args;
    }
    // "Modify" events have an additional "Builder" param - (context, builder, reader, http, persistence)
    if (evtMethod.endsWith('Modify')) {
        if (evtMethod.includes('Message')) {
            args.splice(1, 0, new MessageBuilder_ts_1.MessageBuilder(param1));
        }
        else if (evtMethod.includes('Room')) {
            args.splice(1, 0, new RoomBuilder_ts_1.RoomBuilder(param1));
        }
        return args;
    }
    // From this point on, all events will require (reader, http, persistence, modifier) injected
    args.push(AppAccessorsInstance.getModifier());
    // This guy gets an extra one
    if (evtMethod === 'executePostMessageDeleted') {
        if (!param2) {
            throw jsonrpc_lite_1.JsonRpcError.invalidParams(null);
        }
        args.push(hydrateMessageObjects(param2));
    }
    return args;
}
/**
 * Hydrate the context object with the correct IMessage
 *
 * Some information is lost upon serializing the data from listeners through the pipes,
 * so here we hydrate the complete object as necessary
 */
function hydrateMessageObjects(context) {
    if (objectIsRawMessage(context)) {
        context.room = (0, roomFactory_ts_1.default)(context.room, mod_ts_1.AppAccessorsInstance.getSenderFn());
    }
    else if (context === null || context === void 0 ? void 0 : context.message) {
        context.message = hydrateMessageObjects(context.message);
    }
    return context;
}
function objectIsRawMessage(value) {
    if (!value)
        return false;
    const { id, room, sender, createdAt } = value;
    // Check if we have the fields of a message and the room hasn't already been hydrated
    return !!(id && room && sender && createdAt) && !(room instanceof room_ts_1.Room);
}
