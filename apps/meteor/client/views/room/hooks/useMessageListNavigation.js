"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageListNavigation = void 0;
const focus_1 = require("@react-aria/focus");
const react_1 = require("react");
const react_aria_1 = require("react-aria");
const isListItem = (node) => node.getAttribute('role') === 'listitem' || node.getAttribute('role') === 'link';
const isMessageToolbarAction = (node) => { var _a; return ((_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.getAttribute('role')) === 'toolbar'; };
const isSystemMessage = (node) => node.classList.contains('rcx-message-system');
const isThreadMessage = (node) => node.classList.contains('rcx-message-thread');
/**
 * Custom hook to provide the room navigation by keyboard.
 * @param ref - A ref to the message list DOM element.
 */
const useMessageListNavigation = () => {
    const roomFocusManager = (0, react_aria_1.useFocusManager)();
    const messageListRef = (0, react_1.useCallback)((node) => {
        let lastMessageFocused = null;
        let initialFocus = true;
        if (!node) {
            return;
        }
        const massageListFocusManager = (0, focus_1.createFocusManager)({
            current: node,
        });
        node.addEventListener('keydown', (e) => {
            if (!e.target) {
                return;
            }
            if (!isListItem(e.target)) {
                return;
            }
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    roomFocusManager.focusFirst({
                        from: document.getElementsByClassName('rcx-room-header')[0],
                    });
                }
                else if (isThreadMessage(e.target) || isSystemMessage(e.target) || isMessageToolbarAction(e.target)) {
                    e.preventDefault();
                    e.stopPropagation();
                    roomFocusManager.focusNext({
                        accept: (node) => node.tagName === 'TEXTAREA',
                    });
                }
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                if (e.key === 'ArrowUp') {
                    massageListFocusManager.focusPrevious({ accept: (node) => isListItem(node) });
                }
                if (e.key === 'ArrowDown') {
                    massageListFocusManager.focusNext({ accept: (node) => isListItem(node) });
                }
                lastMessageFocused = document.activeElement;
            }
        });
        node.addEventListener('blur', (e) => {
            var _a;
            if (!((_a = e.relatedTarget) === null || _a === void 0 ? void 0 : _a.classList.contains('focus-visible')) ||
                !(e.currentTarget instanceof HTMLElement && e.relatedTarget instanceof HTMLElement)) {
                return;
            }
            if (!e.currentTarget.contains(e.relatedTarget) && !lastMessageFocused) {
                lastMessageFocused = e.target;
            }
        }, { capture: true });
        node.addEventListener('focus', (e) => {
            var _a;
            const triggeredByKeyboard = (_a = e.target) === null || _a === void 0 ? void 0 : _a.classList.contains('focus-visible');
            if (!triggeredByKeyboard || !(e.currentTarget instanceof HTMLElement && e.relatedTarget instanceof HTMLElement)) {
                return;
            }
            if (initialFocus) {
                massageListFocusManager.focusLast({ accept: (node) => isListItem(node) });
                lastMessageFocused = document.activeElement;
                initialFocus = false;
                return;
            }
            if (lastMessageFocused && !e.currentTarget.contains(e.relatedTarget) && node.contains(e.target)) {
                lastMessageFocused === null || lastMessageFocused === void 0 ? void 0 : lastMessageFocused.focus();
            }
        }, { capture: true });
    }, [roomFocusManager]);
    return {
        messageListRef,
    };
};
exports.useMessageListNavigation = useMessageListNavigation;
