"use strict";
(() => {
    if (typeof window.CustomEvent === 'function') {
        return;
    }
    const CustomEvent = function (type, { bubbles = false, cancelable = false, detail = null } = {}) {
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(type, bubbles, cancelable, detail);
        return evt;
    };
    window.CustomEvent = CustomEvent;
})();
