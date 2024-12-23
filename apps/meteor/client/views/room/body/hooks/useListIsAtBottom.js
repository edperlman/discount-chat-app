"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useListIsAtBottom = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const scrolling_1 = require("../../../../../app/ui/client/views/app/lib/scrolling");
const highOrderFunctions_1 = require("../../../../../lib/utils/highOrderFunctions");
const useListIsAtBottom = () => {
    const atBottomRef = (0, react_1.useRef)(true);
    const innerBoxRef = (0, react_1.useRef)(null);
    const sendToBottom = (0, react_1.useCallback)(() => {
        var _a, _b;
        (_a = innerBoxRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo({ left: 30, top: (_b = innerBoxRef.current) === null || _b === void 0 ? void 0 : _b.scrollHeight });
    }, []);
    const sendToBottomIfNecessary = (0, react_1.useCallback)(() => {
        if (atBottomRef.current === true) {
            sendToBottom();
        }
    }, [atBottomRef, sendToBottom]);
    const isAtBottom = (0, react_1.useCallback)((threshold = 0) => {
        if (!innerBoxRef.current) {
            return true;
        }
        return (0, scrolling_1.isAtBottom)(innerBoxRef.current, threshold);
    }, []);
    const ref = (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        const messageList = node.querySelector('ul');
        if (!messageList) {
            return;
        }
        const observer = new ResizeObserver(() => {
            if (atBottomRef.current === true) {
                node.scrollTo({ left: 30, top: node.scrollHeight });
            }
        });
        observer.observe(messageList);
        node.addEventListener('scroll', (0, highOrderFunctions_1.withThrottling)({ wait: 100 })(() => {
            atBottomRef.current = isAtBottom(100);
        }), {
            passive: true,
        });
    }, [isAtBottom]);
    return {
        atBottomRef,
        innerRef: (0, fuselage_hooks_1.useMergedRefs)(ref, innerBoxRef),
        sendToBottom,
        sendToBottomIfNecessary,
        isAtBottom,
    };
};
exports.useListIsAtBottom = useListIsAtBottom;
