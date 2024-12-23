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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const DropTargetOverlay_1 = __importDefault(require("./DropTargetOverlay"));
const JumpToRecentMessageButton_1 = __importDefault(require("./JumpToRecentMessageButton"));
const LeaderBar_1 = __importDefault(require("./LeaderBar"));
const client_1 = require("../../../../app/models/client");
const isTruthy_1 = require("../../../../lib/isTruthy");
const CustomScrollbars_1 = require("../../../components/CustomScrollbars");
const useEmbeddedLayout_1 = require("../../../hooks/useEmbeddedLayout");
const useReactiveQuery_1 = require("../../../hooks/useReactiveQuery");
const Announcement_1 = __importDefault(require("../Announcement"));
const BubbleDate_1 = require("../BubbleDate");
const MessageList_1 = require("../MessageList");
const LoadingMessagesIndicator_1 = __importDefault(require("./LoadingMessagesIndicator"));
const RetentionPolicyWarning_1 = __importDefault(require("./RetentionPolicyWarning"));
const MessageListErrorBoundary_1 = __importDefault(require("../MessageList/MessageListErrorBoundary"));
const ComposerContainer_1 = __importDefault(require("../composer/ComposerContainer"));
const RoomComposer_1 = __importDefault(require("../composer/RoomComposer/RoomComposer"));
const ChatContext_1 = require("../contexts/ChatContext");
const RoomContext_1 = require("../contexts/RoomContext");
const RoomToolboxContext_1 = require("../contexts/RoomToolboxContext");
const UserCardContext_1 = require("../contexts/UserCardContext");
const useDateScroll_1 = require("../hooks/useDateScroll");
const useMessageListNavigation_1 = require("../hooks/useMessageListNavigation");
const useRetentionPolicy_1 = require("../hooks/useRetentionPolicy");
const RoomForeword_1 = __importDefault(require("./RoomForeword/RoomForeword"));
const UnreadMessagesIndicator_1 = __importDefault(require("./UnreadMessagesIndicator"));
const UploadProgressIndicator_1 = __importDefault(require("./UploadProgressIndicator"));
const useFileUpload_1 = require("./hooks/useFileUpload");
const useGetMore_1 = require("./hooks/useGetMore");
const useGoToHomeOnRemoved_1 = require("./hooks/useGoToHomeOnRemoved");
const useHasNewMessages_1 = require("./hooks/useHasNewMessages");
const useLeaderBanner_1 = require("./hooks/useLeaderBanner");
const useListIsAtBottom_1 = require("./hooks/useListIsAtBottom");
const useQuoteMessageByUrl_1 = require("./hooks/useQuoteMessageByUrl");
const useReadMessageWindowEvents_1 = require("./hooks/useReadMessageWindowEvents");
const useRestoreScrollPosition_1 = require("./hooks/useRestoreScrollPosition");
const useUnreadMessages_1 = require("./hooks/useUnreadMessages");
const RoomBody = () => {
    const chat = (0, ChatContext_1.useChat)();
    if (!chat) {
        throw new Error('No ChatContext provided');
    }
    const t = (0, ui_contexts_1.useTranslation)();
    const isLayoutEmbedded = (0, useEmbeddedLayout_1.useEmbeddedLayout)();
    const room = (0, RoomContext_1.useRoom)();
    const user = (0, ui_contexts_1.useUser)();
    const toolbox = (0, RoomToolboxContext_1.useRoomToolbox)();
    const admin = (0, ui_contexts_1.useRole)('admin');
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const retentionPolicy = (0, useRetentionPolicy_1.useRetentionPolicy)(room);
    const hideFlexTab = (0, ui_contexts_1.useUserPreference)('hideFlexTab') || undefined;
    const hideUsernames = (0, ui_contexts_1.useUserPreference)('hideUsernames');
    const displayAvatars = (0, ui_contexts_1.useUserPreference)('displayAvatars');
    const { hasMorePreviousMessages, hasMoreNextMessages, isLoadingMoreMessages } = (0, RoomContext_1.useRoomMessages)();
    const allowAnonymousRead = (0, ui_contexts_1.useSetting)('Accounts_AllowAnonymousRead', false);
    const canPreviewChannelRoom = (0, ui_contexts_1.usePermission)('preview-c-room');
    const subscribed = !!subscription;
    const canPreview = (0, react_1.useMemo)(() => {
        if (room && room.t !== 'c') {
            return true;
        }
        if (allowAnonymousRead === true) {
            return true;
        }
        if (canPreviewChannelRoom) {
            return true;
        }
        return subscribed;
    }, [allowAnonymousRead, canPreviewChannelRoom, room, subscribed]);
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    const innerBoxRef = (0, react_1.useRef)(null);
    const { wrapperRef: unreadBarWrapperRef, innerRef: unreadBarInnerRef, handleUnreadBarJumpToButtonClick, handleMarkAsReadButtonClick, counter: [unread], } = (0, useUnreadMessages_1.useHandleUnread)(room, subscription);
    const _a = (0, useDateScroll_1.useDateScroll)(), { innerRef: dateScrollInnerRef, bubbleRef, listStyle } = _a, bubbleDate = __rest(_a, ["innerRef", "bubbleRef", "listStyle"]);
    const { innerRef: isAtBottomInnerRef, atBottomRef, sendToBottom, sendToBottomIfNecessary, isAtBottom } = (0, useListIsAtBottom_1.useListIsAtBottom)();
    const { innerRef: getMoreInnerRef } = (0, useGetMore_1.useGetMore)(room._id, atBottomRef);
    const { wrapperRef: leaderBannerWrapperRef, hideLeaderHeader, innerRef: leaderBannerInnerRef } = (0, useLeaderBanner_1.useLeaderBanner)();
    const { uploads, handleUploadFiles, handleUploadProgressClose, targeDrop: [fileUploadTriggerProps, fileUploadOverlayProps], } = (0, useFileUpload_1.useFileUpload)();
    const { innerRef: restoreScrollPositionInnerRef } = (0, useRestoreScrollPosition_1.useRestoreScrollPosition)(room._id);
    const { messageListRef } = (0, useMessageListNavigation_1.useMessageListNavigation)();
    const { handleNewMessageButtonClick, handleJumpToRecentButtonClick, handleComposerResize, hasNewMessages, newMessagesScrollRef } = (0, useHasNewMessages_1.useHasNewMessages)(room._id, user === null || user === void 0 ? void 0 : user._id, atBottomRef, {
        sendToBottom,
        sendToBottomIfNecessary,
        isAtBottom,
    });
    const innerRef = (0, fuselage_hooks_1.useMergedRefs)(dateScrollInnerRef, innerBoxRef, restoreScrollPositionInnerRef, isAtBottomInnerRef, newMessagesScrollRef, leaderBannerInnerRef, unreadBarInnerRef, getMoreInnerRef, messageListRef);
    const wrapperBoxRefs = (0, fuselage_hooks_1.useMergedRefs)(unreadBarWrapperRef, leaderBannerWrapperRef);
    const handleNavigateToPreviousMessage = (0, react_1.useCallback)(() => {
        chat.messageEditing.toPreviousMessage();
    }, [chat.messageEditing]);
    const handleNavigateToNextMessage = (0, react_1.useCallback)(() => {
        chat.messageEditing.toNextMessage();
    }, [chat.messageEditing]);
    const handleCloseFlexTab = (0, react_1.useCallback)((e) => {
        /*
         * check if the element is a button or anchor
         * it considers the role as well
         * usually, the flex tab is closed when clicking outside of it
         * but if the user clicks on a button or anchor, we don't want to close the flex tab
         * because the user could be actually trying to open the flex tab through those elements
         */
        const checkElement = (element) => {
            if (!element) {
                return false;
            }
            if (element instanceof HTMLButtonElement || element.getAttribute('role') === 'button') {
                return true;
            }
            if (element instanceof HTMLAnchorElement || element.getAttribute('role') === 'link') {
                return true;
            }
            return checkElement(element.parentElement);
        };
        if (checkElement(e.target)) {
            return;
        }
        toolbox.closeTab();
    }, [toolbox]);
    const { openUserCard, triggerProps } = (0, UserCardContext_1.useUserCard)();
    const handleOpenUserCard = (0, react_1.useCallback)((event, username) => {
        if (!username) {
            return;
        }
        openUserCard(event, username);
    }, [openUserCard]);
    (0, useGoToHomeOnRemoved_1.useGoToHomeOnRemoved)(room, user === null || user === void 0 ? void 0 : user._id);
    (0, useReadMessageWindowEvents_1.useReadMessageWindowEvents)();
    (0, useQuoteMessageByUrl_1.useQuoteMessageByUrl)();
    const { data: roomLeader } = (0, useReactiveQuery_1.useReactiveQuery)(['rooms', room._id, 'leader', { not: user === null || user === void 0 ? void 0 : user._id }], () => {
        const leaderRoomRole = client_1.RoomRoles.findOne({
            'rid': room._id,
            'roles': 'leader',
            'u._id': { $ne: user === null || user === void 0 ? void 0 : user._id },
        });
        if (!leaderRoomRole) {
            return null;
        }
        return Object.assign(Object.assign({}, leaderRoomRole.u), { name: useRealName ? leaderRoomRole.u.name || leaderRoomRole.u.username : leaderRoomRole.u.username });
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!isLayoutEmbedded && room.announcement && (0, jsx_runtime_1.jsx)(Announcement_1.default, { announcement: room.announcement, announcementDetails: undefined }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: ['main-content-flex', listStyle], children: (0, jsx_runtime_1.jsx)("section", { role: 'presentation', className: `messages-container flex-tab-main-content ${admin ? 'admin' : ''}`, id: `chat-window-${room._id}`, onClick: hideFlexTab && handleCloseFlexTab, children: (0, jsx_runtime_1.jsx)("div", { className: 'messages-container-wrapper', children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: 'messages-container-main', ref: wrapperBoxRefs }, fileUploadTriggerProps, { children: [(0, jsx_runtime_1.jsx)(DropTargetOverlay_1.default, Object.assign({}, fileUploadOverlayProps)), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'absolute', w: 'full', children: [roomLeader ? ((0, jsx_runtime_1.jsx)(LeaderBar_1.default, { _id: roomLeader._id, username: roomLeader.username, name: roomLeader.name, visible: !hideLeaderHeader, onAvatarClick: handleOpenUserCard, triggerProps: triggerProps })) : null, (0, jsx_runtime_1.jsx)("div", { className: ['container-bars', uploads.length && 'show'].filter(isTruthy_1.isTruthy).join(' '), children: uploads.map((upload) => ((0, jsx_runtime_1.jsx)(UploadProgressIndicator_1.default, { id: upload.id, name: upload.name, percentage: upload.percentage, error: upload.error instanceof Error ? upload.error.message : undefined, onClose: handleUploadProgressClose }, upload.id))) }), Boolean(unread) && ((0, jsx_runtime_1.jsx)(UnreadMessagesIndicator_1.default, { count: unread, onJumpButtonClick: handleUnreadBarJumpToButtonClick, onMarkAsReadButtonClick: handleMarkAsReadButtonClick })), (0, jsx_runtime_1.jsx)(BubbleDate_1.BubbleDate, Object.assign({ ref: bubbleRef }, bubbleDate))] }), (0, jsx_runtime_1.jsxs)("div", { className: ['messages-box', roomLeader && !hideLeaderHeader && 'has-leader'].filter(isTruthy_1.isTruthy).join(' '), children: [(0, jsx_runtime_1.jsx)(JumpToRecentMessageButton_1.default, { visible: hasNewMessages, onClick: handleNewMessageButtonClick, text: t('New_messages') }), (0, jsx_runtime_1.jsx)(JumpToRecentMessageButton_1.default, { visible: hasMoreNextMessages, onClick: handleJumpToRecentButtonClick, text: t('Jump_to_recent_messages') }), !canPreview ? ((0, jsx_runtime_1.jsx)("div", { className: 'content room-not-found error-color', children: (0, jsx_runtime_1.jsx)("div", { children: t('You_must_join_to_view_messages_in_this_channel') }) })) : null, (0, jsx_runtime_1.jsx)("div", { className: [
                                                'wrapper',
                                                hasMoreNextMessages && 'has-more-next',
                                                hideUsernames && 'hide-usernames',
                                                !displayAvatars && 'hide-avatar',
                                            ]
                                                .filter(isTruthy_1.isTruthy)
                                                .join(' '), children: (0, jsx_runtime_1.jsx)(MessageListErrorBoundary_1.default, { children: (0, jsx_runtime_1.jsx)(CustomScrollbars_1.CustomScrollbars, { ref: innerRef, children: (0, jsx_runtime_1.jsxs)("ul", { className: 'messages-list', "aria-label": t('Message_list'), "aria-busy": isLoadingMoreMessages, children: [canPreview ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: hasMorePreviousMessages ? ((0, jsx_runtime_1.jsx)("li", { className: 'load-more', children: isLoadingMoreMessages ? (0, jsx_runtime_1.jsx)(LoadingMessagesIndicator_1.default, {}) : null })) : ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)(RoomForeword_1.default, { user: user, room: room }), (retentionPolicy === null || retentionPolicy === void 0 ? void 0 : retentionPolicy.isActive) ? (0, jsx_runtime_1.jsx)(RetentionPolicyWarning_1.default, { room: room }) : null] })) })) : null, (0, jsx_runtime_1.jsx)(MessageList_1.MessageList, { rid: room._id, messageListRef: innerBoxRef }), hasMoreNextMessages ? ((0, jsx_runtime_1.jsx)("li", { className: 'load-more', children: isLoadingMoreMessages ? (0, jsx_runtime_1.jsx)(LoadingMessagesIndicator_1.default, {}) : null })) : null] }) }) }) })] }), (0, jsx_runtime_1.jsx)(RoomComposer_1.default, { children: (0, jsx_runtime_1.jsx)(ComposerContainer_1.default, { subscription: subscription, onResize: handleComposerResize, onNavigateToPreviousMessage: handleNavigateToPreviousMessage, onNavigateToNextMessage: handleNavigateToNextMessage, onUploadFiles: handleUploadFiles }) })] })) }) }) }, room._id)] }));
};
exports.default = (0, react_1.memo)(RoomBody);
