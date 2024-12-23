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
exports.useSubscriptionFromMessageQuery = void 0;
const react_query_1 = require("@tanstack/react-query");
const ChatContext_1 = require("../../../views/room/contexts/ChatContext");
const useSubscriptionFromMessageQuery = (message) => {
    const chat = (0, ChatContext_1.useChat)();
    return (0, react_query_1.useQuery)(['messages', message._id, 'subscription'], () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        return (_a = chat === null || chat === void 0 ? void 0 : chat.data.getSubscriptionFromMessage(message)) !== null && _a !== void 0 ? _a : null;
    }));
};
exports.useSubscriptionFromMessageQuery = useSubscriptionFromMessageQuery;
