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
exports.MessageList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const MessageListItem_1 = require("./MessageListItem");
const client_1 = require("../../../../app/ui-utils/client");
const RoomContext_1 = require("../contexts/RoomContext");
const useFirstUnreadMessageId_1 = require("../hooks/useFirstUnreadMessageId");
const SelectedMessagesProvider_1 = require("../providers/SelectedMessagesProvider");
const useMessages_1 = require("./hooks/useMessages");
const isMessageSequential_1 = require("./lib/isMessageSequential");
const MessageListProvider_1 = __importDefault(require("./providers/MessageListProvider"));
const MessageList = function MessageList({ rid, messageListRef }) {
    const messages = (0, useMessages_1.useMessages)({ rid });
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const showUserAvatar = !!(0, ui_contexts_1.useUserPreference)('displayAvatars');
    const messageGroupingPeriod = (0, ui_contexts_1.useSetting)('Message_GroupingPeriod', 300);
    const firstUnreadMessageId = (0, useFirstUnreadMessageId_1.useFirstUnreadMessageId)();
    return ((0, jsx_runtime_1.jsx)(MessageListProvider_1.default, { messageListRef: messageListRef, children: (0, jsx_runtime_1.jsx)(SelectedMessagesProvider_1.SelectedMessagesProvider, { children: messages.map((message, index, { [index - 1]: previous }) => {
                const sequential = (0, isMessageSequential_1.isMessageSequential)(message, previous, messageGroupingPeriod);
                const showUnreadDivider = firstUnreadMessageId === message._id;
                const system = client_1.MessageTypes.isSystemMessage(message);
                const visible = !(0, core_typings_1.isThreadMessage)(message) && !system;
                return ((0, jsx_runtime_1.jsx)(react_1.Fragment, { children: (0, jsx_runtime_1.jsx)(MessageListItem_1.MessageListItem, { message: message, previous: previous, showUnreadDivider: showUnreadDivider, showUserAvatar: showUserAvatar, sequential: sequential, visible: visible, subscription: subscription, system: system }) }, message._id));
            }) }) }));
};
exports.MessageList = MessageList;
