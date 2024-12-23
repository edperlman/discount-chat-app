"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const EmojiPickerContext_1 = require("../../../../../contexts/EmojiPickerContext");
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const EmojiElement_1 = __importDefault(require("../../../../../views/composer/EmojiPicker/EmojiElement"));
const ChatContext_1 = require("../../../../../views/room/contexts/ChatContext");
const MessageToolbarItem_1 = __importDefault(require("../../MessageToolbarItem"));
const ReactionMessageAction = ({ message, room, subscription }) => {
    const chat = (0, ChatContext_1.useChat)();
    const user = (0, ui_contexts_1.useUser)();
    const setReaction = (0, ui_contexts_1.useMethod)('setReaction');
    const quickReactionsEnabled = (0, ui_client_1.useFeaturePreview)('quickReactions');
    const { quickReactions, addRecentEmoji } = (0, EmojiPickerContext_1.useEmojiPickerData)();
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!chat || !room || (0, core_typings_1.isOmnichannelRoom)(room) || !subscription || message.private || !user) {
        return null;
    }
    if (roomCoordinator_1.roomCoordinator.readOnly(room._id, user) && !room.reactWhenReadOnly) {
        return null;
    }
    const toggleReaction = (emoji) => {
        setReaction(`:${emoji}:`, message._id);
        addRecentEmoji(emoji);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [quickReactionsEnabled &&
                quickReactions.slice(0, 3).map(({ emoji, image }) => {
                    return (0, jsx_runtime_1.jsx)(EmojiElement_1.default, { small: true, title: emoji, emoji: emoji, image: image, onClick: () => toggleReaction(emoji) }, emoji);
                }), (0, jsx_runtime_1.jsx)(MessageToolbarItem_1.default, { id: 'reaction-message', icon: 'add-reaction', title: t('Add_Reaction'), qa: 'Add_Reaction', onClick: (event) => {
                    event.stopPropagation();
                    chat.emojiPicker.open(event.currentTarget, (emoji) => {
                        toggleReaction(emoji);
                    });
                } })] }));
};
exports.default = ReactionMessageAction;
