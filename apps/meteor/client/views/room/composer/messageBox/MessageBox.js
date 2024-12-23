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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const shim_1 = require("use-sync-external-store/shim");
const MessageBoxActionsToolbar_1 = __importDefault(require("./MessageBoxActionsToolbar"));
const MessageBoxFormattingToolbar_1 = __importDefault(require("./MessageBoxFormattingToolbar"));
const MessageBoxHint_1 = __importDefault(require("./MessageBoxHint"));
const MessageBoxReplies_1 = __importDefault(require("./MessageBoxReplies"));
const createComposerAPI_1 = require("../../../../../app/ui-message/client/messageBox/createComposerAPI");
const messageBoxFormatting_1 = require("../../../../../app/ui-message/client/messageBox/messageBoxFormatting");
const getImageExtensionFromMime_1 = require("../../../../../lib/getImageExtensionFromMime");
const useFormatDateAndTime_1 = require("../../../../hooks/useFormatDateAndTime");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const keyCodes_1 = require("../../../../lib/utils/keyCodes");
const AudioMessageRecorder_1 = __importDefault(require("../../../composer/AudioMessageRecorder"));
const VideoMessageRecorder_1 = __importDefault(require("../../../composer/VideoMessageRecorder"));
const ChatContext_1 = require("../../contexts/ChatContext");
const ComposerPopupContext_1 = require("../../contexts/ComposerPopupContext");
const RoomContext_1 = require("../../contexts/RoomContext");
const ComposerBoxPopup_1 = __importDefault(require("../ComposerBoxPopup"));
const ComposerBoxPopupPreview_1 = __importDefault(require("../ComposerBoxPopupPreview"));
const ComposerUserActionIndicator_1 = __importDefault(require("../ComposerUserActionIndicator"));
const useAutoGrow_1 = require("../RoomComposer/hooks/useAutoGrow");
const useComposerBoxPopup_1 = require("../hooks/useComposerBoxPopup");
const useEnablePopupPreview_1 = require("../hooks/useEnablePopupPreview");
const useMessageComposerMergedRefs_1 = require("../hooks/useMessageComposerMergedRefs");
const useMessageBoxAutoFocus_1 = require("./hooks/useMessageBoxAutoFocus");
const useMessageBoxPlaceholder_1 = require("./hooks/useMessageBoxPlaceholder");
const reducer = (_, event) => {
    const target = event.target;
    return Boolean(target.value.trim());
};
const handleFormattingShortcut = (event, formattingButtons, composer) => {
    const isMacOS = navigator.platform.indexOf('Mac') !== -1;
    const isCmdOrCtrlPressed = (isMacOS && event.metaKey) || (!isMacOS && event.ctrlKey);
    if (!isCmdOrCtrlPressed) {
        return false;
    }
    const key = event.key.toLowerCase();
    const formatter = formattingButtons.find((formatter) => 'command' in formatter && formatter.command === key);
    if (!formatter || !('pattern' in formatter)) {
        return false;
    }
    composer.wrapSelection(formatter.pattern);
    return true;
};
const emptySubscribe = () => () => undefined;
const getEmptyFalse = () => false;
const a = [];
const getEmptyArray = () => a;
const MessageBox = ({ tmid, onSend, onJoin, onNavigateToNextMessage, onNavigateToPreviousMessage, onUploadFiles, onEscape, onTyping, tshow, previewUrls, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const chat = (0, ChatContext_1.useChat)();
    const room = (0, RoomContext_1.useRoom)();
    const t = (0, ui_contexts_1.useTranslation)();
    const e2eEnabled = (0, ui_contexts_1.useSetting)('E2E_Enable', false);
    const unencryptedMessagesAllowed = (0, ui_contexts_1.useSetting)('E2E_Allow_Unencrypted_Messages', false);
    const isSlashCommandAllowed = !e2eEnabled || !room.encrypted || unencryptedMessagesAllowed;
    const composerPlaceholder = (0, useMessageBoxPlaceholder_1.useMessageBoxPlaceholder)(t('Message'), room);
    const [typing, setTyping] = (0, react_1.useReducer)(reducer, false);
    const { isMobile } = (0, ui_contexts_1.useLayout)();
    const sendOnEnterBehavior = (0, ui_contexts_1.useUserPreference)('sendOnEnter') || isMobile;
    const sendOnEnter = sendOnEnterBehavior == null || sendOnEnterBehavior === 'normal' || (sendOnEnterBehavior === 'desktop' && !isMobile);
    if (!chat) {
        throw new Error('Chat context not found');
    }
    const textareaRef = (0, react_1.useRef)(null);
    const messageComposerRef = (0, react_1.useRef)(null);
    const shadowRef = (0, react_1.useRef)(null);
    const storageID = `messagebox_${room._id}${tmid ? `-${tmid}` : ''}`;
    const callbackRef = (0, react_1.useCallback)((node) => {
        if (node === null || chat.composer) {
            return;
        }
        chat.setComposerAPI((0, createComposerAPI_1.createComposerAPI)(node, storageID));
    }, [chat, storageID]);
    const autofocusRef = (0, useMessageBoxAutoFocus_1.useMessageBoxAutoFocus)(!isMobile);
    const useEmojis = (0, ui_contexts_1.useUserPreference)('useEmojis');
    const handleOpenEmojiPicker = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!useEmojis) {
            return;
        }
        const ref = messageComposerRef.current;
        chat.emojiPicker.open(ref, (emoji) => { var _a; return (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.insertText(` :${emoji}: `); });
    });
    const handleSendMessage = (0, fuselage_hooks_1.useMutableCallback)(() => {
        var _a, _b, _c;
        const text = (_b = (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '';
        (_c = chat.composer) === null || _c === void 0 ? void 0 : _c.clear();
        clearPopup();
        onSend === null || onSend === void 0 ? void 0 : onSend({
            value: text,
            tshow,
            previewUrls,
            isSlashCommandAllowed,
        });
    });
    const closeEditing = (event) => {
        if (chat.currentEditing) {
            event.preventDefault();
            event.stopPropagation();
            chat.currentEditing.reset().then((reset) => {
                var _a;
                if (!reset) {
                    (_a = chat.currentEditing) === null || _a === void 0 ? void 0 : _a.cancel();
                }
            });
        }
    };
    const handler = (0, fuselage_hooks_1.useMutableCallback)((event) => {
        var _a;
        const { which: keyCode } = event;
        const input = event.target;
        const isSubmitKey = keyCode === keyCodes_1.keyCodes.CARRIAGE_RETURN || keyCode === keyCodes_1.keyCodes.NEW_LINE;
        if (isSubmitKey) {
            const withModifier = event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
            const isSending = (sendOnEnter && !withModifier) || (!sendOnEnter && withModifier);
            event.preventDefault();
            if (!isSending) {
                (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.insertNewLine();
                return false;
            }
            handleSendMessage();
            return false;
        }
        if (chat.composer && handleFormattingShortcut(event, [...messageBoxFormatting_1.formattingButtons], chat.composer)) {
            return;
        }
        if (event.shiftKey || event.ctrlKey || event.metaKey) {
            return;
        }
        switch (event.key) {
            case 'Escape': {
                closeEditing(event);
                if (!input.value.trim())
                    onEscape === null || onEscape === void 0 ? void 0 : onEscape();
                return;
            }
            case 'ArrowUp': {
                if (input.selectionEnd === 0) {
                    event.preventDefault();
                    event.stopPropagation();
                    onNavigateToPreviousMessage === null || onNavigateToPreviousMessage === void 0 ? void 0 : onNavigateToPreviousMessage();
                    if (event.altKey) {
                        input.setSelectionRange(0, 0);
                    }
                }
                return;
            }
            case 'ArrowDown': {
                if (input.selectionEnd === input.value.length) {
                    event.preventDefault();
                    event.stopPropagation();
                    onNavigateToNextMessage === null || onNavigateToNextMessage === void 0 ? void 0 : onNavigateToNextMessage();
                    if (event.altKey) {
                        input.setSelectionRange(input.value.length, input.value.length);
                    }
                }
            }
        }
        onTyping === null || onTyping === void 0 ? void 0 : onTyping();
    });
    const isEditing = (0, shim_1.useSyncExternalStore)((_b = (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.editing.subscribe) !== null && _b !== void 0 ? _b : emptySubscribe, (_d = (_c = chat.composer) === null || _c === void 0 ? void 0 : _c.editing.get) !== null && _d !== void 0 ? _d : getEmptyFalse);
    const isRecordingAudio = (0, shim_1.useSyncExternalStore)((_f = (_e = chat.composer) === null || _e === void 0 ? void 0 : _e.recording.subscribe) !== null && _f !== void 0 ? _f : emptySubscribe, (_h = (_g = chat.composer) === null || _g === void 0 ? void 0 : _g.recording.get) !== null && _h !== void 0 ? _h : getEmptyFalse);
    const isMicrophoneDenied = (0, shim_1.useSyncExternalStore)((_k = (_j = chat.composer) === null || _j === void 0 ? void 0 : _j.isMicrophoneDenied.subscribe) !== null && _k !== void 0 ? _k : emptySubscribe, (_m = (_l = chat.composer) === null || _l === void 0 ? void 0 : _l.isMicrophoneDenied.get) !== null && _m !== void 0 ? _m : getEmptyFalse);
    const isRecordingVideo = (0, shim_1.useSyncExternalStore)((_p = (_o = chat.composer) === null || _o === void 0 ? void 0 : _o.recordingVideo.subscribe) !== null && _p !== void 0 ? _p : emptySubscribe, (_r = (_q = chat.composer) === null || _q === void 0 ? void 0 : _q.recordingVideo.get) !== null && _r !== void 0 ? _r : getEmptyFalse);
    const formatters = (0, shim_1.useSyncExternalStore)((_t = (_s = chat.composer) === null || _s === void 0 ? void 0 : _s.formatters.subscribe) !== null && _t !== void 0 ? _t : emptySubscribe, (_v = (_u = chat.composer) === null || _u === void 0 ? void 0 : _u.formatters.get) !== null && _v !== void 0 ? _v : getEmptyArray);
    const isRecording = isRecordingAudio || isRecordingVideo;
    const { textAreaStyle, shadowStyle } = (0, useAutoGrow_1.useAutoGrow)(textareaRef, shadowRef, isRecordingAudio);
    const canSend = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => roomCoordinator_1.roomCoordinator.verifyCanSendMessage(room._id), [room._id]));
    const sizes = (0, fuselage_hooks_1.useContentBoxSize)(textareaRef);
    const format = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const joinMutation = (0, react_query_1.useMutation)(() => __awaiter(void 0, void 0, void 0, function* () { return onJoin === null || onJoin === void 0 ? void 0 : onJoin(); }));
    const handlePaste = (0, fuselage_hooks_1.useMutableCallback)((event) => {
        const { clipboardData } = event;
        if (!clipboardData) {
            return;
        }
        const items = Array.from(clipboardData.items);
        if (items.some(({ kind, type }) => kind === 'string' && type === 'text/plain')) {
            return;
        }
        const files = items
            .filter((item) => item.kind === 'file' && item.type.indexOf('image/') !== -1)
            .map((item) => {
            const fileItem = item.getAsFile();
            if (!fileItem) {
                return;
            }
            const imageExtension = fileItem ? (0, getImageExtensionFromMime_1.getImageExtensionFromMime)(fileItem.type) : undefined;
            const extension = imageExtension ? `.${imageExtension}` : '';
            Object.defineProperty(fileItem, 'name', {
                writable: true,
                value: `Clipboard - ${format(new Date())}${extension}`,
            });
            return fileItem;
        })
            .filter((file) => !!file);
        if (files.length) {
            event.preventDefault();
            onUploadFiles === null || onUploadFiles === void 0 ? void 0 : onUploadFiles(files);
        }
    });
    const composerPopupConfig = (0, ComposerPopupContext_1.useComposerPopup)();
    const { popup, focused, items, ariaActiveDescendant, suspended, select, commandsRef, callbackRef: c, filter, clearPopup, } = (0, useComposerBoxPopup_1.useComposerBoxPopup)({
        configurations: composerPopupConfig,
    });
    const keyDownHandlerCallbackRef = (0, react_1.useCallback)((node) => {
        if (node === null) {
            return;
        }
        node.addEventListener('keydown', (e) => {
            handler(e);
        });
    }, [handler]);
    const mergedRefs = (0, useMessageComposerMergedRefs_1.useMessageComposerMergedRefs)(c, textareaRef, callbackRef, autofocusRef, keyDownHandlerCallbackRef);
    const shouldPopupPreview = (0, useEnablePopupPreview_1.useEnablePopupPreview)(filter, popup);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [((_w = chat.composer) === null || _w === void 0 ? void 0 : _w.quotedMessages) && (0, jsx_runtime_1.jsx)(MessageBoxReplies_1.default, {}), shouldPopupPreview && popup && ((0, jsx_runtime_1.jsx)(ComposerBoxPopup_1.default, { select: select, items: items, focused: focused, title: popup.title, renderItem: popup.renderItem })), (popup === null || popup === void 0 ? void 0 : popup.preview) && ((0, jsx_runtime_1.jsx)(ComposerBoxPopupPreview_1.default, { select: select, items: items, focused: focused, renderItem: popup.renderItem, ref: commandsRef, rid: room._id, tmid: tmid, suspended: suspended })), (0, jsx_runtime_1.jsx)(MessageBoxHint_1.default, { isEditing: isEditing, e2eEnabled: e2eEnabled, unencryptedMessagesAllowed: unencryptedMessagesAllowed, isMobile: isMobile }), isRecordingVideo && (0, jsx_runtime_1.jsx)(VideoMessageRecorder_1.default, { reference: messageComposerRef, rid: room._id, tmid: tmid }), (0, jsx_runtime_1.jsxs)(ui_composer_1.MessageComposer, { ref: messageComposerRef, variant: isEditing ? 'editing' : undefined, children: [isRecordingAudio && (0, jsx_runtime_1.jsx)(AudioMessageRecorder_1.default, { rid: room._id, isMicrophoneDenied: isMicrophoneDenied }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerInput, { ref: mergedRefs, "aria-label": composerPlaceholder, name: 'msg', disabled: isRecording || !canSend, onChange: setTyping, style: textAreaStyle, placeholder: composerPlaceholder, onPaste: handlePaste, "aria-activedescendant": ariaActiveDescendant }), (0, jsx_runtime_1.jsx)("div", { ref: shadowRef, style: shadowStyle }), (0, jsx_runtime_1.jsxs)(ui_composer_1.MessageComposerToolbar, { children: [(0, jsx_runtime_1.jsxs)(ui_composer_1.MessageComposerToolbarActions, { "aria-label": t('Message_composer_toolbox_primary_actions'), children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { icon: 'emoji', disabled: !useEmojis || isRecording || !canSend, onClick: handleOpenEmojiPicker, title: t('Emoji') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerActionsDivider, {}), chat.composer && formatters.length > 0 && ((0, jsx_runtime_1.jsx)(MessageBoxFormattingToolbar_1.default, { composer: chat.composer, variant: sizes.inlineSize < 480 ? 'small' : 'large', items: formatters, disabled: isRecording || !canSend })), (0, jsx_runtime_1.jsx)(MessageBoxActionsToolbar_1.default, { canSend: canSend, typing: typing, isMicrophoneDenied: isMicrophoneDenied, rid: room._id, tmid: tmid, isRecording: isRecording, variant: sizes.inlineSize < 480 ? 'small' : 'large' })] }), (0, jsx_runtime_1.jsxs)(ui_composer_1.MessageComposerToolbarSubmit, { children: [!canSend && ((0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerButton, { primary: true, onClick: onJoin, loading: joinMutation.isLoading, children: t('Join') })), canSend && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isEditing && (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerButton, { onClick: closeEditing, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { "aria-label": t('Send'), icon: 'send', disabled: !canSend || (!typing && !isEditing), onClick: handleSendMessage, secondary: typing || isEditing, info: typing || isEditing })] }))] })] })] }), (0, jsx_runtime_1.jsx)(ComposerUserActionIndicator_1.default, { rid: room._id, tmid: tmid })] }));
};
exports.default = (0, react_1.memo)(MessageBox);
