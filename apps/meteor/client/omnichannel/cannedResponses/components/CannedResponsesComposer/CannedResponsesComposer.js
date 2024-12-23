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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const InsertPlaceholderDropdown_1 = __importDefault(require("./InsertPlaceholderDropdown"));
const Backdrop_1 = require("../../../../components/Backdrop");
const EmojiPickerContext_1 = require("../../../../contexts/EmojiPickerContext");
const CannedResponsesComposer = (_a) => {
    var { onChange } = _a, props = __rest(_a, ["onChange"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const useEmojisPreference = (0, ui_contexts_1.useUserPreference)('useEmojis');
    const textAreaRef = (0, react_1.useRef)(null);
    const ref = (0, react_1.useRef)(null);
    const [visible, setVisible] = (0, react_1.useState)(false);
    const { open: openEmojiPicker } = (0, EmojiPickerContext_1.useEmojiPicker)();
    const useMarkdownSyntax = (char) => (0, react_1.useCallback)(() => {
        if (textAreaRef === null || textAreaRef === void 0 ? void 0 : textAreaRef.current) {
            const text = textAreaRef.current.value;
            const startPos = textAreaRef.current.selectionStart;
            const endPos = textAreaRef.current.selectionEnd;
            if (char === '[]()') {
                if (startPos !== endPos) {
                    textAreaRef.current.value = `${text.slice(0, startPos)}[${text.slice(startPos, endPos)}]()${text.slice(endPos)}`;
                }
            }
            else {
                textAreaRef.current.value = `${text.slice(0, startPos)}${char}${text.slice(startPos, endPos)}${char}${text.slice(endPos)}`;
            }
            textAreaRef.current.focus();
            if (char === '[]()') {
                if (startPos === endPos) {
                    textAreaRef.current.setSelectionRange(startPos, endPos);
                }
                else {
                    textAreaRef.current.setSelectionRange(endPos + 3, endPos + 3);
                }
            }
            else {
                textAreaRef.current.setSelectionRange(startPos + 1, endPos + 1);
            }
            onChange === null || onChange === void 0 ? void 0 : onChange(textAreaRef.current.value);
        }
    }, [char]);
    const onClickEmoji = (emoji) => {
        if (textAreaRef === null || textAreaRef === void 0 ? void 0 : textAreaRef.current) {
            const text = textAreaRef.current.value;
            const startPos = textAreaRef.current.selectionStart;
            const emojiValue = `:${emoji}: `;
            textAreaRef.current.value = text.slice(0, startPos) + emojiValue + text.slice(startPos);
            textAreaRef.current.focus();
            textAreaRef.current.setSelectionRange(startPos + emojiValue.length, startPos + emojiValue.length);
            onChange === null || onChange === void 0 ? void 0 : onChange(textAreaRef.current.value);
        }
    };
    const handleOpenEmojiPicker = () => {
        if (!useEmojisPreference) {
            return;
        }
        if (!(textAreaRef === null || textAreaRef === void 0 ? void 0 : textAreaRef.current)) {
            throw new Error('Missing textAreaRef');
        }
        openEmojiPicker(textAreaRef.current, (emoji) => onClickEmoji(emoji));
    };
    const openPlaceholderSelect = () => {
        (textAreaRef === null || textAreaRef === void 0 ? void 0 : textAreaRef.current) && textAreaRef.current.focus();
        setVisible(!visible);
    };
    return ((0, jsx_runtime_1.jsxs)(ui_composer_1.MessageComposer, { children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerInput, Object.assign({ ref: textAreaRef, rows: 10, onChange: onChange }, props)), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerToolbar, { children: (0, jsx_runtime_1.jsxs)(ui_composer_1.MessageComposerToolbarActions, { "aria-label": t('Message_composer_toolbox_primary_actions'), children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { icon: 'emoji', disabled: !useEmojisPreference, onClick: handleOpenEmojiPicker, title: t('Emoji') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerActionsDivider, {}), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { icon: 'bold', onClick: useMarkdownSyntax('*'), title: t('Bold') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { icon: 'italic', onClick: useMarkdownSyntax('_'), title: t('Italic') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { icon: 'strike', onClick: useMarkdownSyntax('~'), title: t('Strike') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { icon: 'link', onClick: useMarkdownSyntax('[]()'), title: t('Link') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerActionsDivider, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { ref: ref, small: true, onClick: openPlaceholderSelect, children: t('Insert_Placeholder') }), (0, jsx_runtime_1.jsx)(Backdrop_1.Backdrop, { display: visible ? 'block' : 'none', onClick: () => {
                                (textAreaRef === null || textAreaRef === void 0 ? void 0 : textAreaRef.current) && textAreaRef.current.focus();
                                setVisible(false);
                            } }), (0, jsx_runtime_1.jsx)(fuselage_1.PositionAnimated, { visible: visible ? 'visible' : 'hidden', anchor: ref, children: (0, jsx_runtime_1.jsx)(fuselage_1.Tile, { elevation: '1', w: '224px', children: (0, jsx_runtime_1.jsx)(InsertPlaceholderDropdown_1.default, { onChange: onChange, textAreaRef: textAreaRef, setVisible: setVisible }) }) })] }) })] }));
};
exports.default = (0, react_1.memo)(CannedResponsesComposer);
