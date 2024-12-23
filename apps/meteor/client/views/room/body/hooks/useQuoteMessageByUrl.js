"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuoteMessageByUrl = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const ChatContext_1 = require("../../contexts/ChatContext");
const useQuoteMessageByUrl = () => {
    const replyMID = (0, ui_contexts_1.useSearchParameter)('reply');
    const chat = (0, ChatContext_1.useChat)();
    if (!chat) {
        throw new Error('No ChatContext provided');
    }
    (0, react_1.useEffect)(() => {
        if (!replyMID) {
            return;
        }
        chat.data.getMessageByID(replyMID).then((message) => {
            var _a;
            if (!message) {
                return;
            }
            (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.quoteMessage(message);
        });
    }, [chat.data, chat.composer, replyMID]);
};
exports.useQuoteMessageByUrl = useQuoteMessageByUrl;
