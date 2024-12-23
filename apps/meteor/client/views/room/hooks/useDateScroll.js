"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDateScroll = void 0;
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const highOrderFunctions_1 = require("../../../../lib/utils/highOrderFunctions");
const DateListProvider_1 = require("../providers/DateListProvider");
const useDateScroll = (margin = 8) => {
    const [bubbleDate, setBubbleDate] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)({
        date: '',
        show: false,
        style: undefined,
        bubbleDateClassName: undefined,
        offset: 0,
    }));
    const { list } = (0, DateListProvider_1.useDateListController)();
    const bubbleRef = (0, react_1.useRef)(null);
    const callbackRef = (0, react_1.useCallback)((node) => {
        var _a;
        if (!node) {
            return;
        }
        const bubbleOffset = ((_a = bubbleRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().bottom) || 0;
        const onScroll = (() => {
            let timeout;
            return (elements) => {
                clearTimeout(timeout);
                // Gets the first non visible message date and sets the bubble date to it
                const [date, message, style] = [...elements].reduce((ret, message) => {
                    // Sanitize elements
                    if (!message.dataset.id) {
                        return ret;
                    }
                    const { top, height } = message.getBoundingClientRect();
                    const { id } = message.dataset;
                    // if the bubble if between the divider and the top, position it at the top of the divider
                    if (top > bubbleOffset && top < bubbleOffset + height) {
                        return [
                            ret[0] || new Date(id).toISOString(),
                            ret[1] || message,
                            {
                                position: 'absolute',
                                top: `${top - height - bubbleOffset + margin}px`,
                                left: ' 50%',
                                translate: '-50%',
                                zIndex: 11,
                            },
                        ];
                    }
                    if (top < bubbleOffset + height) {
                        return [
                            new Date(id).toISOString(),
                            message,
                            {
                                position: 'absolute',
                                top: `${margin}px`,
                                left: ' 50%',
                                translate: '-50%',
                                zIndex: 11,
                            },
                        ];
                    }
                    return ret;
                }, []);
                // We always keep the previous date if we don't have a new one, so when the bubble disappears it doesn't flicker
                setBubbleDate((current) => (Object.assign(Object.assign(Object.assign(Object.assign({}, current), { date: '' }), (date && { date })), { show: Boolean(date), style, bubbleDateClassName: (0, css_in_js_1.css) `
							opacity: 0;
							transition: opacity 0.6s;
							&.bubble-visible {
								opacity: 1;
							}
						` })));
                if (message) {
                    const { top } = message.getBoundingClientRect();
                    if (top < bubbleOffset && top > 0) {
                        return;
                    }
                }
                timeout = setTimeout(() => setBubbleDate((current) => (Object.assign(Object.assign({}, current), { show: false }))), 1000);
            };
        })();
        const fn = (0, highOrderFunctions_1.withThrottling)({ wait: 30 })(() => {
            onScroll(list);
        });
        node.addEventListener('scroll', fn, { passive: true });
    }, [list, margin, setBubbleDate]);
    const listStyle = bubbleDate.show && bubbleDate.date
        ? (0, css_in_js_1.css) `
					position: relative;
					& [data-time='${bubbleDate.date.replaceAll(/[-T:.]/g, '').substring(0, 8)}'] {
						opacity: 0;
					}
				`
        : undefined;
    return {
        innerRef: callbackRef,
        bubbleRef,
        listStyle,
        bubbleDate: bubbleDate.date,
        bubbleDateStyle: bubbleDate.style,
        showBubble: Boolean(bubbleDate.show),
        bubbleDateClassName: bubbleDate.bubbleDateClassName,
    };
};
exports.useDateScroll = useDateScroll;
