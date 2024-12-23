"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHasNewMessages = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = require("react");
const client_1 = require("../../../../../app/ui-utils/client");
const callbacks_1 = require("../../../../../lib/callbacks");
const highOrderFunctions_1 = require("../../../../../lib/utils/highOrderFunctions");
const ChatContext_1 = require("../../contexts/ChatContext");
const useHasNewMessages = (rid, uid, atBottomRef, { sendToBottom, sendToBottomIfNecessary, isAtBottom, }) => {
    const chat = (0, ChatContext_1.useChat)();
    if (!chat) {
        throw new Error('No ChatContext provided');
    }
    const [hasNewMessages, setHasNewMessages] = (0, react_1.useState)(false);
    const handleNewMessageButtonClick = (0, react_1.useCallback)(() => {
        var _a;
        atBottomRef.current = true;
        sendToBottomIfNecessary();
        setHasNewMessages(false);
        (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.focus();
    }, [atBottomRef, chat.composer, sendToBottomIfNecessary]);
    const handleJumpToRecentButtonClick = (0, react_1.useCallback)(() => {
        atBottomRef.current = true;
        client_1.RoomHistoryManager.clear(rid);
        client_1.RoomHistoryManager.getMoreIfIsEmpty(rid);
    }, [atBottomRef, rid]);
    const handleComposerResize = (0, react_1.useCallback)(() => {
        sendToBottomIfNecessary();
        setHasNewMessages(false);
    }, [sendToBottomIfNecessary]);
    (0, react_1.useEffect)(() => {
        callbacks_1.callbacks.add('streamNewMessage', (msg) => {
            if (rid !== msg.rid || (0, core_typings_1.isEditedMessage)(msg) || msg.tmid) {
                return;
            }
            if (msg.u._id === uid) {
                sendToBottom();
                setHasNewMessages(false);
                return;
            }
            if (!isAtBottom()) {
                setHasNewMessages(true);
            }
        }, callbacks_1.callbacks.priority.MEDIUM, rid);
        return () => {
            callbacks_1.callbacks.remove('streamNewMessage', rid);
        };
    }, [isAtBottom, rid, sendToBottom, uid]);
    const ref = (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        node.addEventListener('scroll', (0, highOrderFunctions_1.withThrottling)({ wait: 100 })(() => {
            atBottomRef.current && setHasNewMessages(false);
        }), {
            passive: true,
        });
    }, [atBottomRef]);
    return {
        newMessagesScrollRef: ref,
        handleNewMessageButtonClick,
        handleJumpToRecentButtonClick,
        handleComposerResize,
        hasNewMessages,
    };
};
exports.useHasNewMessages = useHasNewMessages;
