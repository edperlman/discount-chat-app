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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIKitLivechatBlockInteractionContext = exports.UIKitActionButtonInteractionContext = exports.UIKitViewCloseInteractionContext = exports.UIKitViewSubmitInteractionContext = exports.UIKitBlockInteractionContext = exports.uikitInteractions = void 0;
exports.default = handleUIKitInteraction;
const jsonrpc_lite_1 = require("jsonrpc-lite");
const require_ts_1 = require("../../lib/require.ts");
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const mod_ts_1 = require("../../lib/accessors/mod.ts");
exports.uikitInteractions = [
    'executeBlockActionHandler',
    'executeViewSubmitHandler',
    'executeViewClosedHandler',
    'executeActionButtonHandler',
    'executeLivechatBlockActionHandler',
];
_a = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/uikit/UIKitInteractionContext.js'), exports.UIKitBlockInteractionContext = _a.UIKitBlockInteractionContext, exports.UIKitViewSubmitInteractionContext = _a.UIKitViewSubmitInteractionContext, exports.UIKitViewCloseInteractionContext = _a.UIKitViewCloseInteractionContext, exports.UIKitActionButtonInteractionContext = _a.UIKitActionButtonInteractionContext;
exports.UIKitLivechatBlockInteractionContext = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/uikit/livechat/UIKitLivechatInteractionContext.js').UIKitLivechatBlockInteractionContext;
function handleUIKitInteraction(method, params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.uikitInteractions.includes(method)) {
            return jsonrpc_lite_1.JsonRpcError.methodNotFound(null);
        }
        if (!Array.isArray(params)) {
            return jsonrpc_lite_1.JsonRpcError.invalidParams(null);
        }
        const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
        const interactionHandler = app === null || app === void 0 ? void 0 : app[method];
        if (!app || typeof interactionHandler !== 'function') {
            return jsonrpc_lite_1.JsonRpcError.methodNotFound({
                message: `App does not implement method "${method}"`,
            });
        }
        const [payload] = params;
        if (!payload) {
            return jsonrpc_lite_1.JsonRpcError.invalidParams(null);
        }
        let context;
        switch (method) {
            case 'executeBlockActionHandler':
                context = new exports.UIKitBlockInteractionContext(payload);
                break;
            case 'executeViewSubmitHandler':
                context = new exports.UIKitViewSubmitInteractionContext(payload);
                break;
            case 'executeViewClosedHandler':
                context = new exports.UIKitViewCloseInteractionContext(payload);
                break;
            case 'executeActionButtonHandler':
                context = new exports.UIKitActionButtonInteractionContext(payload);
                break;
            case 'executeLivechatBlockActionHandler':
                context = new exports.UIKitLivechatBlockInteractionContext(payload);
                break;
        }
        try {
            return yield interactionHandler.call(app, context, mod_ts_1.AppAccessorsInstance.getReader(), mod_ts_1.AppAccessorsInstance.getHttp(), mod_ts_1.AppAccessorsInstance.getPersistence(), mod_ts_1.AppAccessorsInstance.getModifier());
        }
        catch (e) {
            return jsonrpc_lite_1.JsonRpcError.internalError({ message: e.message });
        }
    });
}
