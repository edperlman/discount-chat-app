"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useJumpToMessage = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const MessageListContext_1 = require("../../../../components/message/list/MessageListContext");
const messageHighlightSubscription_1 = require("../providers/messageHighlightSubscription");
// this is an arbitrary value so that there's a gap between the header and the message;
const SCROLL_EXTRA_OFFSET = 60;
const useJumpToMessage = (messageId) => {
    const jumpToMessageParam = (0, MessageListContext_1.useMessageListJumpToMessageParam)();
    const listRef = (0, MessageListContext_1.useMessageListRef)();
    const router = (0, ui_contexts_1.useRouter)();
    const ref = (0, react_1.useCallback)((node) => {
        if (!node || !scroll) {
            return;
        }
        setTimeout(() => {
            if (listRef === null || listRef === void 0 ? void 0 : listRef.current) {
                const wrapper = listRef.current;
                const containerRect = wrapper.getBoundingClientRect();
                const messageRect = node.getBoundingClientRect();
                const offset = messageRect.top - containerRect.top;
                const scrollPosition = wrapper.scrollTop;
                const newScrollPosition = scrollPosition + offset - SCROLL_EXTRA_OFFSET;
                wrapper.scrollTo({ top: newScrollPosition, behavior: 'smooth' });
            }
            const _a = router.getSearchParameters(), { msg: _ } = _a, search = __rest(_a, ["msg"]);
            router.navigate({
                pathname: router.getLocationPathname(),
                search,
            }, { replace: true });
            (0, messageHighlightSubscription_1.setHighlightMessage)(messageId);
            setTimeout(messageHighlightSubscription_1.clearHighlightMessage, 2000);
        }, 500);
    }, [listRef, messageId, router]);
    if (jumpToMessageParam !== messageId) {
        return undefined;
    }
    return ref;
};
exports.useJumpToMessage = useJumpToMessage;
