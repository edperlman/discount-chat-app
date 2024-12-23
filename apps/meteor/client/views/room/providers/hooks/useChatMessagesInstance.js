"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatMessagesInstance = useChatMessagesInstance;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useInstance_1 = require("./useInstance");
const ChatMessages_1 = require("../../../../../app/ui/client/lib/ChatMessages");
const EmojiPickerContext_1 = require("../../../../contexts/EmojiPickerContext");
const useUiKitActionManager_1 = require("../../../../uikit/hooks/useUiKitActionManager");
const RoomContext_1 = require("../../contexts/RoomContext");
const useE2EERoomState_1 = require("../../hooks/useE2EERoomState");
function useChatMessagesInstance({ rid, tmid, encrypted, }) {
    const uid = (0, ui_contexts_1.useUserId)();
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const e2eRoomState = (0, useE2EERoomState_1.useE2EERoomState)(rid);
    const chatMessages = (0, useInstance_1.useInstance)(() => {
        const instance = new ChatMessages_1.ChatMessages({ rid, tmid, uid, actionManager });
        return [instance, () => instance.release()];
    }, [rid, tmid, uid, encrypted, e2eRoomState]);
    (0, react_1.useEffect)(() => {
        if (subscription) {
            chatMessages === null || chatMessages === void 0 ? void 0 : chatMessages.readStateManager.updateSubscription(subscription);
        }
    }, [subscription, chatMessages === null || chatMessages === void 0 ? void 0 : chatMessages.readStateManager]);
    chatMessages.emojiPicker = (0, EmojiPickerContext_1.useEmojiPicker)();
    return chatMessages;
}
