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
exports.processSetReaction = void 0;
const client_1 = require("../../../../app/emoji/client");
const callWithErrorHandling_1 = require("../../utils/callWithErrorHandling");
const processSetReaction = (chat_1, _a) => __awaiter(void 0, [chat_1, _a], void 0, function* (chat, { msg }) {
    const match = msg.trim().match(/^\+(:.*?:)$/m);
    if (!match) {
        return false;
    }
    const [, reaction] = match;
    if (!client_1.emoji.list[reaction]) {
        return false;
    }
    const lastMessage = yield chat.data.findLastMessage();
    if (!lastMessage) {
        return false;
    }
    yield (0, callWithErrorHandling_1.callWithErrorHandling)('setReaction', reaction, lastMessage._id);
    return true;
});
exports.processSetReaction = processSetReaction;
