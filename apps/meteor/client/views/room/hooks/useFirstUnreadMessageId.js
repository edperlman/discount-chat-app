"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFirstUnreadMessageId = void 0;
const shim_1 = require("use-sync-external-store/shim");
const ChatContext_1 = require("../contexts/ChatContext");
const useFirstUnreadMessageId = () => {
    const chat = (0, ChatContext_1.useChat)();
    if (!chat) {
        throw new Error('useFirstUnreadMessageId must be used within a ChatContextProvider');
    }
    return (0, shim_1.useSyncExternalStore)(chat.readStateManager.onUnreadStateChange, chat.readStateManager.getFirstUnreadRecordId);
};
exports.useFirstUnreadMessageId = useFirstUnreadMessageId;
