"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useComposerBoxPopup = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const useComposerBoxPopupQueries_1 = require("./useComposerBoxPopupQueries");
const ChatContext_1 = require("../../contexts/ChatContext");
const keys = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
};
const useComposerBoxPopup = ({ configurations, }) => {
    const [popup, setPopup] = (0, react_1.useState)(undefined);
    const [focused, setFocused] = (0, react_1.useState)(undefined);
    const [filter, setFilter] = (0, react_1.useState)('');
    const commandsRef = (0, react_1.useRef)();
    const { queries: items, suspended } = (0, useComposerBoxPopupQueries_1.useComposerBoxPopupQueries)(filter, popup);
    const chat = (0, ChatContext_1.useChat)();
    const ariaActiveDescendant = focused ? `popup-item-${focused._id}` : undefined;
    (0, react_1.useEffect)(() => {
        if (!popup) {
            return;
        }
        if ((popup === null || popup === void 0 ? void 0 : popup.preview) && suspended) {
            setFocused(undefined);
            return;
        }
        setFocused((focused) => {
            var _a;
            const sortedItems = items
                .filter((item) => item.isSuccess)
                .flatMap((item) => item.data)
                .sort((a, b) => (('sort' in a && a.sort) || 0) - (('sort' in b && b.sort) || 0));
            return (_a = sortedItems.find((item) => item._id === (focused === null || focused === void 0 ? void 0 : focused._id))) !== null && _a !== void 0 ? _a : sortedItems[0];
        });
    }, [items, popup, suspended]);
    const select = (0, fuselage_hooks_1.useMutableCallback)((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!popup) {
            throw new Error('No popup is open');
        }
        if ((_a = commandsRef.current) === null || _a === void 0 ? void 0 : _a.select) {
            commandsRef.current.select(item);
        }
        else {
            const value = (_b = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _b === void 0 ? void 0 : _b.substring(0, (_c = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _c === void 0 ? void 0 : _c.selection.start);
            const selector = (_d = popup.matchSelectorRegex) !== null && _d !== void 0 ? _d : (popup.triggerAnywhere ? new RegExp(`(?:^| |\n)(${popup.trigger})([^\\s]*$)`) : new RegExp(`(?:^)(${popup.trigger})([^\\s]*$)`));
            const result = value === null || value === void 0 ? void 0 : value.match(selector);
            if (!result || !value) {
                return;
            }
            (_e = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _e === void 0 ? void 0 : _e.replaceText(((_g = (_f = popup.prefix) !== null && _f !== void 0 ? _f : popup.trigger) !== null && _g !== void 0 ? _g : '') + popup.getValue(item) + ((_h = popup.suffix) !== null && _h !== void 0 ? _h : ''), {
                start: value.lastIndexOf(result[1] + result[2]),
                end: (_j = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _j === void 0 ? void 0 : _j.selection.start,
            });
        }
        setPopup(undefined);
        setFocused(undefined);
    });
    const setConfigByInput = (0, fuselage_hooks_1.useMutableCallback)(() => {
        var _a, _b, _c, _d, _e, _f;
        const value = (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.substring(0, (_b = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _b === void 0 ? void 0 : _b.selection.start);
        if (!value) {
            setPopup(undefined);
            setFocused(undefined);
            return;
        }
        const configuration = configurations.find(({ trigger, matchSelectorRegex, triggerAnywhere, triggerLength }) => {
            const selector = matchSelectorRegex !== null && matchSelectorRegex !== void 0 ? matchSelectorRegex : (triggerAnywhere ? new RegExp(`(?:^| |\n)(${trigger})[^\\s]*$`) : new RegExp(`(?:^)(${trigger})[^\\s]*$`));
            const result = selector.test(value);
            if (!triggerLength || !result) {
                return result;
            }
            const filter = value.match(selector);
            return filter && triggerLength < filter[0].length;
        });
        setPopup(configuration);
        if (!configuration) {
            setFocused(undefined);
            setFilter('');
        }
        if (configuration) {
            const selector = (_c = configuration.matchSelectorRegex) !== null && _c !== void 0 ? _c : (configuration.triggerAnywhere
                ? new RegExp(`(?:^| |\n)(${configuration.trigger})([^\\s]*$)`)
                : new RegExp(`(?:^)(${configuration.trigger})([^\\s]*$)`));
            const result = value.match(selector);
            setFilter((_f = (_e = (_d = commandsRef.current) === null || _d === void 0 ? void 0 : _d.getFilter) === null || _e === void 0 ? void 0 : _e.call(_d)) !== null && _f !== void 0 ? _f : (result ? result[2] : ''));
        }
        return configuration;
    });
    const onFocus = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (popup) {
            return;
        }
        setConfigByInput();
    });
    const keyup = (0, fuselage_hooks_1.useMutableCallback)((event) => {
        if (!setConfigByInput()) {
            return;
        }
        if (!popup) {
            return;
        }
        if (popup.closeOnEsc === true && event.which === keys.ESC) {
            setPopup(undefined);
            setFocused(undefined);
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    });
    const keydown = (0, fuselage_hooks_1.useMutableCallback)((event) => {
        if (!popup) {
            return;
        }
        if (event.which === keys.ENTER || event.which === keys.TAB) {
            if (!focused) {
                return;
            }
            select(focused);
            event.preventDefault();
            event.stopImmediatePropagation();
            return true;
        }
        if (event.which === keys.ARROW_UP && !(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)) {
            setFocused((focused) => {
                const list = items
                    .filter((item) => item.isSuccess)
                    .flatMap((item) => item.data)
                    .sort((a, b) => (('sort' in a && a.sort) || 0) - (('sort' in b && b.sort) || 0));
                if (!list) {
                    return;
                }
                const focusedIndex = list.findIndex((item) => item === focused);
                return (focusedIndex > 0 ? list[focusedIndex - 1] : list[list.length - 1]);
            });
            event.preventDefault();
            event.stopImmediatePropagation();
            return true;
        }
        if (event.which === keys.ARROW_DOWN && !(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)) {
            setFocused((focused) => {
                const list = items
                    .filter((item) => item.isSuccess)
                    .flatMap((item) => item.data)
                    .sort((a, b) => (('sort' in a && a.sort) || 0) - (('sort' in b && b.sort) || 0));
                if (!list) {
                    return undefined;
                }
                const focusedIndex = list.findIndex((item) => item === focused);
                return (focusedIndex < list.length - 1 ? list[focusedIndex + 1] : list[0]);
            });
            event.preventDefault();
            event.stopImmediatePropagation();
            return true;
        }
    });
    const clearPopup = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (!popup) {
            return;
        }
        setPopup(undefined);
        setFocused(undefined);
        setFilter('');
    });
    const callbackRef = (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        node.addEventListener('keyup', keyup);
        node.addEventListener('keydown', keydown);
        node.addEventListener('focus', onFocus);
    }, [keyup, keydown, onFocus]);
    if (!popup) {
        return {
            callbackRef,
            focused: undefined,
            items: undefined,
            ariaActiveDescendant: undefined,
            popup: undefined,
            select: undefined,
            suspended: true,
            commandsRef,
            filter: undefined,
            clearPopup,
        };
    }
    return {
        focused,
        items,
        ariaActiveDescendant,
        popup,
        select,
        filter,
        suspended,
        commandsRef,
        callbackRef,
        clearPopup,
    };
};
exports.useComposerBoxPopup = useComposerBoxPopup;
