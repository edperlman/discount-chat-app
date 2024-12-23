"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEmojiPickerData = exports.usePreviewEmoji = exports.useEmojiPicker = exports.EmojiPickerContext = void 0;
const react_1 = require("react");
exports.EmojiPickerContext = (0, react_1.createContext)(undefined);
const useEmojiPickerContext = () => {
    const context = (0, react_1.useContext)(exports.EmojiPickerContext);
    if (!context) {
        throw new Error('Must be running in EmojiPicker Context');
    }
    return context;
};
const useEmojiPicker = () => ({
    open: useEmojiPickerContext().open,
    isOpen: useEmojiPickerContext().isOpen,
    close: useEmojiPickerContext().close,
});
exports.useEmojiPicker = useEmojiPicker;
const usePreviewEmoji = () => ({
    emojiToPreview: useEmojiPickerContext().emojiToPreview,
    handlePreview: useEmojiPickerContext().handlePreview,
    handleRemovePreview: useEmojiPickerContext().handleRemovePreview,
});
exports.usePreviewEmoji = usePreviewEmoji;
const useEmojiPickerData = () => {
    const { actualTone, addRecentEmoji, currentCategory, customItemsLimit, getEmojiListsByCategory, quickReactions, recentEmojis, setActualTone, setCurrentCategory, setCustomItemsLimit, setRecentEmojis, } = useEmojiPickerContext();
    return {
        addRecentEmoji,
        getEmojiListsByCategory,
        recentEmojis,
        setRecentEmojis,
        actualTone,
        currentCategory,
        setCurrentCategory,
        customItemsLimit,
        setCustomItemsLimit,
        setActualTone,
        quickReactions,
    };
};
exports.useEmojiPickerData = useEmojiPickerData;
