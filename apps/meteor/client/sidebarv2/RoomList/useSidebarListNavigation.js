"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSidebarListNavigation = void 0;
const focus_1 = require("@react-aria/focus");
const react_1 = require("react");
const isListItem = (node) => node.classList.contains('rcx-sidebar-v2-item');
const isCollapseGroup = (node) => node.classList.contains('rcx-sidebar-v2-collapse-group__bar');
const isListItemMenu = (node) => node.classList.contains('rcx-sidebar-v2-item__menu');
/**
 * Custom hook to provide the sidebar navigation by keyboard.
 * @param ref - A ref to the message list DOM element.
 */
const useSidebarListNavigation = () => {
    const sidebarListFocusManager = (0, focus_1.useFocusManager)();
    const sidebarListRef = (0, react_1.useCallback)((node) => {
        let lastItemFocused = null;
        if (!node) {
            return;
        }
        node.addEventListener('keydown', (e) => {
            if (!e.target) {
                return;
            }
            if (!isListItem(e.target) && !isCollapseGroup(e.target)) {
                return;
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                e.stopPropagation();
                if (e.shiftKey) {
                    sidebarListFocusManager.focusPrevious({
                        accept: (node) => !isListItem(node) && !isListItemMenu(node) && !isCollapseGroup(node),
                    });
                }
                else if (isListItemMenu(e.target)) {
                    sidebarListFocusManager.focusNext({
                        accept: (node) => !isListItem(node) && !isListItemMenu(node) && !isCollapseGroup(node),
                    });
                }
                else {
                    sidebarListFocusManager.focusNext({
                        accept: (node) => !isListItem(node) && !isCollapseGroup(node),
                    });
                }
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                if (e.key === 'ArrowUp') {
                    sidebarListFocusManager.focusPrevious({ accept: (node) => isListItem(node) || isCollapseGroup(node) });
                }
                if (e.key === 'ArrowDown') {
                    sidebarListFocusManager.focusNext({ accept: (node) => isListItem(node) || isCollapseGroup(node) });
                }
                lastItemFocused = document.activeElement;
            }
        });
        node.addEventListener('blur', (e) => {
            var _a;
            if (!((_a = e.relatedTarget) === null || _a === void 0 ? void 0 : _a.classList.contains('focus-visible')) ||
                !(e.currentTarget instanceof HTMLElement && e.relatedTarget instanceof HTMLElement)) {
                return;
            }
            if (!e.currentTarget.contains(e.relatedTarget) && !lastItemFocused) {
                lastItemFocused = e.target;
            }
        }, { capture: true });
        node.addEventListener('focus', (e) => {
            var _a;
            const triggeredByKeyboard = (_a = e.target) === null || _a === void 0 ? void 0 : _a.classList.contains('focus-visible');
            if (!triggeredByKeyboard || !(e.currentTarget instanceof HTMLElement && e.relatedTarget instanceof HTMLElement)) {
                return;
            }
            if (lastItemFocused && !e.currentTarget.contains(e.relatedTarget) && node.contains(e.target)) {
                lastItemFocused === null || lastItemFocused === void 0 ? void 0 : lastItemFocused.focus();
            }
        }, { capture: true });
    }, [sidebarListFocusManager]);
    return { sidebarListRef };
};
exports.useSidebarListNavigation = useSidebarListNavigation;
