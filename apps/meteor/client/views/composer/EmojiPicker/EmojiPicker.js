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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const CategoriesResult_1 = __importDefault(require("./CategoriesResult"));
const EmojiPickerCategoryItem_1 = __importDefault(require("./EmojiPickerCategoryItem"));
const EmojiPickerDropDown_1 = __importDefault(require("./EmojiPickerDropDown"));
const SearchingResult_1 = __importDefault(require("./SearchingResult"));
const ToneSelector_1 = __importDefault(require("./ToneSelector"));
const ToneSelectorWrapper_1 = __importDefault(require("./ToneSelector/ToneSelectorWrapper"));
const client_1 = require("../../../../app/emoji/client");
const EmojiPickerContext_1 = require("../../../contexts/EmojiPickerContext");
const useIsVisible_1 = require("../../room/hooks/useIsVisible");
const EmojiPicker = ({ reference, onClose, onPickEmoji }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const ref = (0, react_1.useRef)(reference);
    const categoriesPosition = (0, react_1.useRef)([]);
    const virtuosoRef = (0, react_1.useRef)(null);
    const emojiContainerRef = (0, react_1.useRef)(null);
    const [isVisibleRef, isInputVisible] = (0, useIsVisible_1.useIsVisible)();
    const textInputRef = (0, react_1.useRef)();
    const mergedTextInputRef = (0, fuselage_hooks_1.useMergedRefs)(isVisibleRef, textInputRef);
    const emojiCategories = (0, client_1.getCategoriesList)();
    const canManageEmoji = (0, ui_contexts_1.usePermission)('manage-emoji');
    const customEmojiRoute = (0, ui_contexts_1.useRoute)('emoji-custom');
    const [searching, setSearching] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [searchResults, setSearchResults] = (0, react_1.useState)([]);
    const { emojiToPreview, handleRemovePreview } = (0, EmojiPickerContext_1.usePreviewEmoji)();
    const { recentEmojis, setCurrentCategory, addRecentEmoji, setRecentEmojis, actualTone, currentCategory, getEmojiListsByCategory, customItemsLimit, setActualTone, setCustomItemsLimit, } = (0, EmojiPickerContext_1.useEmojiPickerData)();
    (0, react_1.useEffect)(() => () => handleRemovePreview(), [handleRemovePreview]);
    const scrollCategories = (0, fuselage_hooks_1.useMediaQuery)('(width < 340px)');
    (0, fuselage_hooks_1.useOutsideClick)([emojiContainerRef], onClose);
    (0, react_1.useLayoutEffect)(() => {
        if (!reference) {
            return;
        }
        const resizeObserver = new ResizeObserver(() => {
            const anchorRect = reference.getBoundingClientRect();
            if (anchorRect.width === 0 && anchorRect.height === 0) {
                // The element is hidden, skip it
                ref.current = null;
                return;
            }
            ref.current = reference;
        });
        resizeObserver.observe(reference);
        return () => {
            resizeObserver.disconnect();
        };
    }, [reference]);
    (0, react_1.useEffect)(() => {
        if (textInputRef.current && isInputVisible) {
            textInputRef.current.focus();
        }
    }, [isInputVisible]);
    const handleSelectEmoji = (event) => {
        var _a;
        event.stopPropagation();
        const _emoji = (_a = event.currentTarget.dataset) === null || _a === void 0 ? void 0 : _a.emoji;
        if (!_emoji) {
            return;
        }
        let tone = '';
        for (const emojiPackage in client_1.emoji.packages) {
            if (client_1.emoji.packages.hasOwnProperty(emojiPackage)) {
                if (actualTone > 0 && client_1.emoji.packages[emojiPackage].toneList.hasOwnProperty(_emoji)) {
                    tone = `_tone${actualTone}`;
                }
            }
        }
        setSearchTerm('');
        onPickEmoji(_emoji + tone);
        addRecentEmoji(_emoji + tone);
        onClose();
    };
    (0, react_1.useEffect)(() => {
        if (recentEmojis.length === 0 && currentCategory === 'recent') {
            const customEmojiList = getEmojiListsByCategory().filter(({ key }) => key === 'rocket');
            handleGoToCategory(customEmojiList.length > 0 ? 0 : 1);
        }
    }, [actualTone, recentEmojis, getEmojiListsByCategory, currentCategory, setRecentEmojis]);
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentCategory('');
        setSearching(e.target.value !== '');
        const emojisResult = (0, client_1.getEmojisBySearchTerm)(e.target.value, actualTone, recentEmojis, setRecentEmojis);
        if (emojisResult.filter((emoji) => emoji.image).length === 0) {
            setCurrentCategory('no-results');
        }
        setSearchResults(emojisResult);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    const handleLoadMore = () => {
        setCustomItemsLimit(customItemsLimit + 90);
    };
    // FIXME: not able to type the event scroll yet due the virtuoso version
    const handleScroll = (event) => {
        var _a;
        const scrollTop = event === null || event === void 0 ? void 0 : event.scrollTop;
        const last = (_a = categoriesPosition.current) === null || _a === void 0 ? void 0 : _a.filter((pos) => pos.top <= scrollTop).pop();
        if (!last) {
            return;
        }
        const { el } = last;
        const category = el.id.replace('emoji-list-category-', '');
        setCurrentCategory(category);
    };
    const handleGoToCategory = (categoryIndex) => {
        var _a;
        setSearching(false);
        (_a = virtuosoRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex({ index: categoryIndex });
    };
    const handleGoToAddCustom = () => {
        customEmojiRoute.push();
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)(EmojiPickerDropDown_1.default, { reference: ref, ref: emojiContainerRef, children: (0, jsx_runtime_1.jsxs)(ui_client_1.EmojiPickerContainer, { role: 'dialog', "aria-label": t('Emoji_picker'), onKeyDown: handleKeyDown, children: [(0, jsx_runtime_1.jsx)(ui_client_1.EmojiPickerHeader, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput
                    // FIXME: remove autoFocus prop when rewriting the emojiPicker dropdown
                    , { 
                        // FIXME: remove autoFocus prop when rewriting the emojiPicker dropdown
                        autoFocus: true, ref: mergedTextInputRef, value: searchTerm, onChange: handleSearch, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }), placeholder: t('Search'), "aria-label": t('Search') }) }), (0, jsx_runtime_1.jsx)(ui_client_1.EmojiPickerCategoryHeader, Object.assign({ role: 'tablist' }, (scrollCategories && { style: { overflowX: 'scroll' } }), { children: emojiCategories.map((category, index) => ((0, jsx_runtime_1.jsx)(EmojiPickerCategoryItem_1.default, { index: index, category: category, active: category.key === currentCategory, handleGoToCategory: handleGoToCategory }, category.key))) })), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mb: 12 }), (0, jsx_runtime_1.jsxs)(ui_client_1.EmojiPickerListArea, { role: 'tabpanel', children: [searching && (0, jsx_runtime_1.jsx)(SearchingResult_1.default, { searchResults: searchResults, handleSelectEmoji: handleSelectEmoji }), !searching && ((0, jsx_runtime_1.jsx)(CategoriesResult_1.default, { ref: virtuosoRef, emojiListByCategory: getEmojiListsByCategory(), categoriesPosition: categoriesPosition, customItemsLimit: customItemsLimit, handleLoadMore: handleLoadMore, handleSelectEmoji: handleSelectEmoji, handleScroll: handleScroll }))] }), (0, jsx_runtime_1.jsxs)(ui_client_1.EmojiPickerPreviewArea, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [emojiToPreview && (0, jsx_runtime_1.jsx)(ui_client_1.EmojiPickerPreview, { emoji: emojiToPreview.emoji, name: emojiToPreview.name }), canManageEmoji && emojiToPreview === null && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, onClick: handleGoToAddCustom, children: t('Add_emoji') }))] }), (0, jsx_runtime_1.jsx)(ToneSelectorWrapper_1.default, { caption: t('Skin_tone'), children: (0, jsx_runtime_1.jsx)(ToneSelector_1.default, { tone: actualTone, setTone: setActualTone }) })] }), (0, jsx_runtime_1.jsx)(ui_client_1.EmojiPickerFooter, { children: t('Powered_by_JoyPixels') })] }) }));
};
exports.default = EmojiPicker;
