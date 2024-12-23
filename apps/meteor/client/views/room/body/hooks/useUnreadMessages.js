"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandleUnread = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../../app/models/client");
const client_2 = require("../../../../../app/ui-utils/client");
const highOrderFunctions_1 = require("../../../../../lib/utils/highOrderFunctions");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const setMessageJumpQueryStringParameter_1 = require("../../../../lib/utils/setMessageJumpQueryStringParameter");
const ChatContext_1 = require("../../contexts/ChatContext");
const useUnreadMessages = (room) => {
    const notLoadedCount = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => client_2.RoomHistoryManager.getRoom(room._id).unreadNotLoaded.get(), [room._id]));
    const [loadedCount, setLoadedCount] = (0, react_1.useState)(0);
    const count = (0, react_1.useMemo)(() => notLoadedCount + loadedCount, [notLoadedCount, loadedCount]);
    const since = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => { var _a; return (_a = client_2.LegacyRoomManager.getOpenedRoomByRid(room._id)) === null || _a === void 0 ? void 0 : _a.unreadSince.get(); }, [room._id]));
    return (0, react_1.useMemo)(() => {
        if (count && since) {
            return [{ count, since }, setLoadedCount];
        }
        return [undefined, setLoadedCount];
    }, [count, since]);
};
const useHandleUnread = (room, subscription) => {
    var _a;
    const messagesBoxRef = (0, react_1.useRef)(null);
    const subscribed = Boolean(subscription);
    const [unread, setUnreadCount] = useUnreadMessages(room);
    const [lastMessageDate, setLastMessageDate] = (0, react_1.useState)();
    const chat = (0, ChatContext_1.useChat)();
    if (!chat) {
        throw new Error('No ChatContext provided');
    }
    const handleUnreadBarJumpToButtonClick = (0, react_1.useCallback)(() => {
        const rid = room._id;
        const { firstUnread } = client_2.RoomHistoryManager.getRoom(rid);
        let message = firstUnread === null || firstUnread === void 0 ? void 0 : firstUnread.get();
        if (!message) {
            message = client_1.Messages.findOne({ rid, ts: { $gt: unread === null || unread === void 0 ? void 0 : unread.since } }, { sort: { ts: 1 }, limit: 1 });
        }
        if (!message) {
            return;
        }
        (0, setMessageJumpQueryStringParameter_1.setMessageJumpQueryStringParameter)(message === null || message === void 0 ? void 0 : message._id);
        setUnreadCount(0);
    }, [room._id, unread === null || unread === void 0 ? void 0 : unread.since, setUnreadCount]);
    const handleMarkAsReadButtonClick = (0, react_1.useCallback)(() => {
        chat.readStateManager.markAsRead();
        setUnreadCount(0);
    }, [chat.readStateManager, setUnreadCount]);
    (0, react_1.useEffect)(() => {
        if (!subscribed) {
            setUnreadCount(0);
            return;
        }
        const count = client_1.Messages.find({
            rid: room._id,
            ts: { $lte: lastMessageDate, $gt: subscription === null || subscription === void 0 ? void 0 : subscription.ls },
        }).count();
        setUnreadCount(count);
    }, [lastMessageDate, room._id, setUnreadCount, subscribed, subscription === null || subscription === void 0 ? void 0 : subscription.ls]);
    const router = (0, ui_contexts_1.useRouter)();
    const debouncedReadMessageRead = (0, react_1.useMemo)(() => (0, highOrderFunctions_1.withDebouncing)({ wait: 500 })(() => {
        if (subscribed) {
            chat.readStateManager.attemptMarkAsRead();
        }
    }), [chat.readStateManager, subscribed]);
    (0, react_1.useEffect)(() => router.subscribeToRouteChange(() => {
        const routeName = router.getRouteName();
        if (!routeName || !roomCoordinator_1.roomCoordinator.isRouteNameKnown(routeName)) {
            return;
        }
        debouncedReadMessageRead();
    }), [debouncedReadMessageRead, room._id, router, subscribed, subscription === null || subscription === void 0 ? void 0 : subscription.alert, subscription === null || subscription === void 0 ? void 0 : subscription.unread]);
    (0, react_1.useEffect)(() => {
        if (!(unread === null || unread === void 0 ? void 0 : unread.count)) {
            return debouncedReadMessageRead();
        }
    }, [debouncedReadMessageRead, room._id, unread === null || unread === void 0 ? void 0 : unread.count]);
    const ref = (0, react_1.useCallback)((wrapper) => {
        if (!wrapper) {
            return;
        }
        const getElementFromPoint = (topOffset = 0) => {
            const messagesBox = messagesBoxRef.current;
            if (!messagesBox) {
                return;
            }
            const messagesBoxLeft = messagesBox.getBoundingClientRect().left + window.pageXOffset;
            const messagesBoxTop = messagesBox.getBoundingClientRect().top + window.pageYOffset;
            const messagesBoxWidth = parseFloat(getComputedStyle(messagesBox).width);
            let element;
            if (document.dir === 'rtl') {
                element = document.elementFromPoint(messagesBoxLeft + messagesBoxWidth - 2, messagesBoxTop + topOffset + 2);
            }
            else {
                element = document.elementFromPoint(messagesBoxLeft + 2, messagesBoxTop + topOffset + 2);
            }
            if ((element === null || element === void 0 ? void 0 : element.classList.contains('rcx-message')) || (element === null || element === void 0 ? void 0 : element.classList.contains('rcx-message--sequential'))) {
                return element;
            }
        };
        wrapper.addEventListener('scroll', (0, highOrderFunctions_1.withThrottling)({ wait: 300 })(() => {
            Tracker.afterFlush(() => {
                const lastInvisibleMessageOnScreen = getElementFromPoint(0) || getElementFromPoint(20) || getElementFromPoint(40);
                if (!lastInvisibleMessageOnScreen) {
                    setUnreadCount(0);
                    return;
                }
                const lastMessage = client_1.Messages.findOne(lastInvisibleMessageOnScreen.id);
                if (!lastMessage) {
                    setUnreadCount(0);
                    return;
                }
                setLastMessageDate(lastMessage.ts);
            });
        }));
    }, [setUnreadCount]);
    return {
        innerRef: ref,
        wrapperRef: messagesBoxRef,
        handleUnreadBarJumpToButtonClick,
        handleMarkAsReadButtonClick,
        counter: [(_a = unread === null || unread === void 0 ? void 0 : unread.count) !== null && _a !== void 0 ? _a : 0, unread === null || unread === void 0 ? void 0 : unread.since],
    };
};
exports.useHandleUnread = useHandleUnread;
