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
exports.getMessageRedactionHandler = void 0;
const Federation_1 = require("../../../../Federation");
class DeleteMessageHandler {
    constructor(internalMessageAdapter, message, federatedUser) {
        this.internalMessageAdapter = internalMessageAdapter;
        this.message = message;
        this.federatedUser = federatedUser;
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.internalMessageAdapter.deleteMessage(this.message, this.federatedUser);
        });
    }
}
class UnreactToMessageHandler {
    constructor(internalMessageAdapter, message, federatedUser, redactsEvents) {
        this.internalMessageAdapter = internalMessageAdapter;
        this.message = message;
        this.federatedUser = federatedUser;
        this.redactsEvents = redactsEvents;
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedEventId = Federation_1.Federation.escapeExternalFederationEventId(this.redactsEvents);
            const reaction = Object.keys(this.message.reactions || {}).find((key) => {
                var _a, _b, _c, _d, _e, _f;
                return ((_c = (_b = (_a = this.message.reactions) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b.federationReactionEventIds) === null || _c === void 0 ? void 0 : _c[normalizedEventId]) === this.federatedUser.getUsername() &&
                    ((_f = (_e = (_d = this.message.reactions) === null || _d === void 0 ? void 0 : _d[key]) === null || _e === void 0 ? void 0 : _e.usernames) === null || _f === void 0 ? void 0 : _f.includes(this.federatedUser.getUsername() || ''));
            });
            if (!reaction) {
                return;
            }
            yield this.internalMessageAdapter.unreactToMessage(this.federatedUser, this.message, reaction, this.redactsEvents);
        });
    }
}
const getMessageRedactionHandler = (internalMessageAdapter, redactsEvent, federatedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield internalMessageAdapter.getMessageByFederationId(redactsEvent);
    const messageWithReaction = yield internalMessageAdapter.findOneByFederationIdOnReactions(redactsEvent, federatedUser);
    if (!message && !messageWithReaction) {
        return;
    }
    if (messageWithReaction) {
        return new UnreactToMessageHandler(internalMessageAdapter, messageWithReaction, federatedUser, redactsEvent);
    }
    if (message) {
        return new DeleteMessageHandler(internalMessageAdapter, message, federatedUser);
    }
});
exports.getMessageRedactionHandler = getMessageRedactionHandler;
