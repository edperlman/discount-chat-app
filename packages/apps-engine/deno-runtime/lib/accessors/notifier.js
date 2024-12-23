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
exports.Notifier = void 0;
const MessageBuilder_ts_1 = require("./builders/MessageBuilder.ts");
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const require_ts_1 = require("../require.ts");
const { TypingScope } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/accessors/INotifier.js');
class Notifier {
    constructor(senderFn) {
        this.senderFn = senderFn;
    }
    notifyUser(user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.sender || !message.sender.id) {
                const appUser = yield this.getAppUser();
                message.sender = appUser;
            }
            yield this.callMessageBridge('doNotifyUser', [user, message, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')]);
        });
    }
    notifyRoom(room, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.sender || !message.sender.id) {
                const appUser = yield this.getAppUser();
                message.sender = appUser;
            }
            yield this.callMessageBridge('doNotifyRoom', [room, message, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')]);
        });
    }
    typing(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options.scope = options.scope || TypingScope.Room;
            if (!options.username) {
                const appUser = yield this.getAppUser();
                options.username = (appUser && appUser.name) || '';
            }
            const appId = AppObjectRegistry_ts_1.AppObjectRegistry.get('id');
            yield this.callMessageBridge('doTyping', [Object.assign(Object.assign({}, options), { isTyping: true }), appId]);
            return () => __awaiter(this, void 0, void 0, function* () {
                yield this.callMessageBridge('doTyping', [Object.assign(Object.assign({}, options), { isTyping: false }), appId]);
            });
        });
    }
    getMessageBuilder() {
        return new MessageBuilder_ts_1.MessageBuilder();
    }
    callMessageBridge(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.senderFn({
                method: `bridges:getMessageBridge:${method}`,
                params,
            });
        });
    }
    getAppUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.senderFn({ method: 'bridges:getUserBridge:doGetAppUser', params: [AppObjectRegistry_ts_1.AppObjectRegistry.get('id')] });
            return response.result;
        });
    }
}
exports.Notifier = Notifier;
