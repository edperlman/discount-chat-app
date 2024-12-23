"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const useUpdateCustomEmoji_1 = require("./useUpdateCustomEmoji");
const client_1 = require("../../../app/emoji/client");
const EmojiPickerContext_1 = require("../../contexts/EmojiPickerContext");
const EmojiPicker_1 = __importDefault(require("../../views/composer/EmojiPicker/EmojiPicker"));
const DEFAULT_ITEMS_LIMIT = 90;
const EmojiPickerProvider = ({ children }) => {
    const [emojiPicker, setEmojiPicker] = (0, react_1.useState)(null);
    const [emojiToPreview, setEmojiToPreview] = (0, fuselage_hooks_1.useDebouncedState)(null, 100);
    const [recentEmojis, setRecentEmojis] = (0, fuselage_hooks_1.useLocalStorage)('emoji.recent', []);
    const [actualTone, setActualTone] = (0, fuselage_hooks_1.useLocalStorage)('emoji.tone', 0);
    const [currentCategory, setCurrentCategory] = (0, react_1.useState)('recent');
    const [customItemsLimit, setCustomItemsLimit] = (0, react_1.useState)(DEFAULT_ITEMS_LIMIT);
    const [frequentEmojis, setFrequentEmojis] = (0, fuselage_hooks_1.useLocalStorage)('emoji.frequent', []);
    const [quickReactions, setQuickReactions] = (0, react_1.useState)(() => (0, client_1.getFrequentEmoji)(frequentEmojis.map(([emoji]) => emoji)));
    (0, useUpdateCustomEmoji_1.useUpdateCustomEmoji)();
    const addFrequentEmojis = (0, react_1.useCallback)((emoji) => {
        const empty = frequentEmojis.some(([emojiName]) => emojiName === emoji) ? [] : [[emoji, 0]];
        const sortedFrequent = [...empty, ...frequentEmojis]
            .map(([emojiName, count]) => {
            return (emojiName === emoji ? [emojiName, Math.min(count + 5, 100)] : [emojiName, Math.max(count - 1, 0)]);
        })
            .sort(([, frequentA], [, frequentB]) => frequentB - frequentA);
        setFrequentEmojis(sortedFrequent);
        setQuickReactions((0, client_1.getFrequentEmoji)(sortedFrequent.map(([emoji]) => emoji)));
    }, [frequentEmojis, setFrequentEmojis]);
    const [getEmojiListsByCategory, setEmojiListsByCategoryGetter] = (0, react_1.useState)(() => () => []);
    // TODO: improve this update
    const updateEmojiListByCategory = (0, react_1.useCallback)((categoryKey, limit = DEFAULT_ITEMS_LIMIT) => {
        setEmojiListsByCategoryGetter((getEmojiListsByCategory) => () => getEmojiListsByCategory().map((category) => categoryKey === category.key
            ? Object.assign(Object.assign({}, category), { emojis: {
                    list: (0, client_1.createEmojiList)(category.key, null, recentEmojis, setRecentEmojis),
                    limit: category.key === client_1.CUSTOM_CATEGORY ? limit | customItemsLimit : null,
                } }) : category));
    }, [customItemsLimit, recentEmojis, setRecentEmojis]);
    (0, react_1.useEffect)(() => {
        if ((recentEmojis === null || recentEmojis === void 0 ? void 0 : recentEmojis.length) > 0) {
            (0, client_1.updateRecent)(recentEmojis);
        }
        setEmojiListsByCategoryGetter(() => () => (0, client_1.createPickerEmojis)(customItemsLimit, actualTone, recentEmojis, setRecentEmojis));
    }, [actualTone, recentEmojis, customItemsLimit, currentCategory, setRecentEmojis, frequentEmojis]);
    const addRecentEmoji = (0, react_1.useCallback)((_emoji) => {
        addFrequentEmojis(_emoji);
        const recent = recentEmojis || [];
        const pos = recent.indexOf(_emoji);
        if (pos !== -1) {
            recent.splice(pos, 1);
        }
        recent.unshift(_emoji);
        // limit recent emojis to 27 (3 rows of 9)
        recent.splice(27);
        setRecentEmojis(recent);
        client_1.emoji.packages.base.emojisByCategory.recent = recent;
        updateEmojiListByCategory('recent');
    }, [recentEmojis, setRecentEmojis, updateEmojiListByCategory, addFrequentEmojis]);
    const open = (0, react_1.useCallback)((ref, callback) => {
        return setEmojiPicker((0, jsx_runtime_1.jsx)(EmojiPicker_1.default, { reference: ref, onClose: () => setEmojiPicker(null), onPickEmoji: (emoji) => callback(emoji) }));
    }, []);
    const handlePreview = (0, react_1.useCallback)((emoji, name) => setEmojiToPreview({ emoji, name }), [setEmojiToPreview]);
    const handleRemovePreview = (0, react_1.useCallback)(() => setEmojiToPreview(null), [setEmojiToPreview]);
    const contextValue = (0, react_1.useMemo)(() => ({
        isOpen: emojiPicker !== null,
        close: () => setEmojiPicker(null),
        open,
        emojiToPreview,
        handlePreview,
        handleRemovePreview,
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
    }), [
        emojiPicker,
        open,
        emojiToPreview,
        addRecentEmoji,
        getEmojiListsByCategory,
        recentEmojis,
        setRecentEmojis,
        actualTone,
        currentCategory,
        setCurrentCategory,
        customItemsLimit,
        setActualTone,
        quickReactions,
        handlePreview,
        handleRemovePreview,
    ]);
    return ((0, jsx_runtime_1.jsxs)(EmojiPickerContext_1.EmojiPickerContext.Provider, { value: contextValue, children: [children, emojiPicker] }));
};
exports.default = EmojiPickerProvider;
