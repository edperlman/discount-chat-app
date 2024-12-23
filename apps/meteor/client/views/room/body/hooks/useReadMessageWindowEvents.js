"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReadMessageWindowEvents = useReadMessageWindowEvents;
const react_1 = require("react");
const ChatContext_1 = require("../../contexts/ChatContext");
function useReadMessageWindowEvents() {
    const chat = (0, ChatContext_1.useChat)();
    (0, react_1.useEffect)(() => {
        return chat === null || chat === void 0 ? void 0 : chat.readStateManager.handleWindowEvents();
    }, [chat === null || chat === void 0 ? void 0 : chat.readStateManager]);
}
