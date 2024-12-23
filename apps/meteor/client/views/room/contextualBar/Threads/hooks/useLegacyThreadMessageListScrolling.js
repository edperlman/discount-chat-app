"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLegacyThreadMessageListScrolling = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const callbacks_1 = require("../../../../../../lib/callbacks");
const RoomContext_1 = require("../../../contexts/RoomContext");
const useLegacyThreadMessageListScrolling = (mainMessage) => {
    const listWrapperRef = (0, react_1.useRef)(null);
    const listRef = (0, react_1.useRef)(null);
    const atBottomRef = (0, react_1.useRef)(true);
    const onScroll = (0, react_1.useCallback)(({ scrollHeight, scrollTop, clientHeight }) => {
        atBottomRef.current = scrollTop >= scrollHeight - clientHeight;
    }, []);
    const sendToBottomIfNecessary = (0, react_1.useCallback)(() => {
        if (atBottomRef.current === true) {
            const listWrapper = listWrapperRef.current;
            listWrapper === null || listWrapper === void 0 ? void 0 : listWrapper.scrollTo(30, listWrapper.scrollHeight);
        }
    }, []);
    const room = (0, RoomContext_1.useRoom)();
    const user = (0, ui_contexts_1.useUser)();
    (0, react_1.useEffect)(() => {
        callbacks_1.callbacks.add('streamNewMessage', (msg) => {
            if (room._id !== msg.rid || (0, core_typings_1.isEditedMessage)(msg) || msg.tmid !== mainMessage._id) {
                return;
            }
            if (msg.u._id === (user === null || user === void 0 ? void 0 : user._id)) {
                atBottomRef.current = true;
                sendToBottomIfNecessary();
            }
        }, callbacks_1.callbacks.priority.MEDIUM, `thread-scroll-${room._id}`);
        return () => {
            callbacks_1.callbacks.remove('streamNewMessage', `thread-scroll-${room._id}`);
        };
    }, [room._id, sendToBottomIfNecessary, user === null || user === void 0 ? void 0 : user._id, mainMessage._id]);
    (0, react_1.useEffect)(() => {
        const observer = new ResizeObserver(() => {
            sendToBottomIfNecessary();
        });
        if (listWrapperRef.current)
            observer.observe(listWrapperRef.current);
        if (listRef.current)
            observer.observe(listRef.current);
        return () => {
            observer.disconnect();
        };
    }, [sendToBottomIfNecessary]);
    return { listWrapperRef, listRef, requestScrollToBottom: sendToBottomIfNecessary, onScroll };
};
exports.useLegacyThreadMessageListScrolling = useLegacyThreadMessageListScrolling;
