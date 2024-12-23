"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerClick = exports.delegate = void 0;
const delegate = ({ parent = document, eventName, elementSelector, listener, }) => {
    const effectiveListener = function (e) {
        // loop parent nodes from the target to the delegation node
        for (let { target } = e; target && target instanceof Element && target !== this; target = target.parentNode) {
            if (target.matches(elementSelector)) {
                listener.call(target, e, target);
                break;
            }
        }
    };
    parent.addEventListener(eventName, effectiveListener, false);
    return () => {
        parent.removeEventListener(eventName, effectiveListener, false);
    };
};
exports.delegate = delegate;
const triggerClick = (target) => {
    const clickEvent = document.createEvent('HTMLEvents');
    clickEvent.initEvent('click', true, false);
    target === null || target === void 0 ? void 0 : target.dispatchEvent(clickEvent);
};
exports.triggerClick = triggerClick;
