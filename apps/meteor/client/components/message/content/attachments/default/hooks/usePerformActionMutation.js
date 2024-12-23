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
exports.usePerformActionMutation = void 0;
const react_query_1 = require("@tanstack/react-query");
const ChatContext_1 = require("../../../../../../views/room/contexts/ChatContext");
const usePerformActionMutation = (options) => {
    const chat = (0, ChatContext_1.useChat)();
    return (0, react_query_1.useMutation)((_a) => __awaiter(void 0, [_a], void 0, function* ({ processingType, msg, mid }) {
        var _b, _c;
        if (!chat) {
            return;
        }
        switch (processingType) {
            case 'sendMessage':
                if (!msg)
                    return;
                yield chat.flows.sendMessage({ text: msg });
                return;
            case 'respondWithMessage':
                if (!msg)
                    return;
                yield ((_b = chat.composer) === null || _b === void 0 ? void 0 : _b.replyWith(msg));
                return;
            case 'respondWithQuotedMessage':
                if (!mid)
                    return;
                const message = yield chat.data.getMessageByID(mid);
                yield ((_c = chat.composer) === null || _c === void 0 ? void 0 : _c.quoteMessage(message));
        }
    }), options);
};
exports.usePerformActionMutation = usePerformActionMutation;
