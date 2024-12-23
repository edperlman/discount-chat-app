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
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const ThreadMessageList_1 = __importDefault(require("./ThreadMessageList"));
const callbacks_1 = require("../../../../../../lib/callbacks");
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const MessageListErrorBoundary_1 = __importDefault(require("../../../MessageList/MessageListErrorBoundary"));
const DropTargetOverlay_1 = __importDefault(require("../../../body/DropTargetOverlay"));
const useFileUploadDropTarget_1 = require("../../../body/hooks/useFileUploadDropTarget");
const ComposerContainer_1 = __importDefault(require("../../../composer/ComposerContainer"));
const RoomComposer_1 = __importDefault(require("../../../composer/RoomComposer/RoomComposer"));
const ChatContext_1 = require("../../../contexts/ChatContext");
const RoomContext_1 = require("../../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../../contexts/RoomToolboxContext");
const DateListProvider_1 = require("../../../providers/DateListProvider");
const ThreadChat = ({ mainMessage }) => {
    const [fileUploadTriggerProps, fileUploadOverlayProps] = (0, useFileUploadDropTarget_1.useFileUploadDropTarget)();
    const sendToChannelPreference = (0, ui_contexts_1.useUserPreference)('alsoSendThreadToChannel');
    const [sendToChannel, setSendToChannel] = (0, react_1.useState)(() => {
        switch (sendToChannelPreference) {
            case 'always':
                return true;
            case 'never':
                return false;
            default:
                return !mainMessage.tcount;
        }
    });
    const handleSend = (0, react_1.useCallback)(() => {
        if (sendToChannelPreference === 'default') {
            setSendToChannel(false);
        }
    }, [sendToChannelPreference]);
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const handleComposerEscape = (0, react_1.useCallback)(() => {
        closeTab();
    }, [closeTab]);
    const chat = (0, ChatContext_1.useChat)();
    const handleNavigateToPreviousMessage = (0, react_1.useCallback)(() => {
        chat === null || chat === void 0 ? void 0 : chat.messageEditing.toPreviousMessage();
    }, [chat === null || chat === void 0 ? void 0 : chat.messageEditing]);
    const handleNavigateToNextMessage = (0, react_1.useCallback)(() => {
        chat === null || chat === void 0 ? void 0 : chat.messageEditing.toNextMessage();
    }, [chat === null || chat === void 0 ? void 0 : chat.messageEditing]);
    const handleUploadFiles = (0, react_1.useCallback)((files) => {
        chat === null || chat === void 0 ? void 0 : chat.flows.uploadFiles(files);
    }, [chat === null || chat === void 0 ? void 0 : chat.flows]);
    const room = (0, RoomContext_1.useRoom)();
    const readThreads = (0, ui_contexts_1.useMethod)('readThreads');
    (0, react_1.useEffect)(() => {
        callbacks_1.callbacks.add('streamNewMessage', (msg) => {
            if (room._id !== msg.rid || (0, core_typings_1.isEditedMessage)(msg) || msg.tmid !== mainMessage._id) {
                return;
            }
            readThreads(mainMessage._id);
        }, callbacks_1.callbacks.priority.MEDIUM, `thread-${room._id}`);
        return () => {
            callbacks_1.callbacks.remove('streamNewMessage', `thread-${room._id}`);
        };
    }, [mainMessage._id, readThreads, room._id]);
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const sendToChannelID = (0, fuselage_hooks_1.useUniqueId)();
    const t = (0, ui_contexts_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, Object.assign({ flexShrink: 1, flexGrow: 1, paddingInline: 0 }, fileUploadTriggerProps, { children: (0, jsx_runtime_1.jsxs)(DateListProvider_1.DateListProvider, { children: [(0, jsx_runtime_1.jsx)(DropTargetOverlay_1.default, Object.assign({}, fileUploadOverlayProps)), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'section', position: 'relative', display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, flexBasis: 'auto', height: 'full', children: [(0, jsx_runtime_1.jsx)(MessageListErrorBoundary_1.default, { children: (0, jsx_runtime_1.jsx)(ThreadMessageList_1.default, { mainMessage: mainMessage }) }), (0, jsx_runtime_1.jsx)(RoomComposer_1.default, { children: (0, jsx_runtime_1.jsx)(ComposerContainer_1.default, { tmid: mainMessage._id, subscription: subscription, onSend: handleSend, onEscape: handleComposerEscape, onNavigateToPreviousMessage: handleNavigateToPreviousMessage, onNavigateToNextMessage: handleNavigateToNextMessage, onUploadFiles: handleUploadFiles, tshow: sendToChannel, children: (0, jsx_runtime_1.jsx)(fuselage_1.Field, { marginBlock: 8, children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { justifyContent: 'initial', children: [(0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { id: sendToChannelID, checked: sendToChannel, onChange: () => setSendToChannel((checked) => !checked), name: 'alsoSendThreadToChannel' }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { mis: 'x8', htmlFor: sendToChannelID, color: 'annotation', fontScale: 'p2', children: t('Also_send_to_channel') })] }) }) }) })] })] }) })));
};
exports.default = ThreadChat;
