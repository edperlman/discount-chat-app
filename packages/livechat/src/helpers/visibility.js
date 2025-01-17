"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visibility = void 0;
exports.visibility = (() => {
    if (typeof document.hidden !== 'undefined') {
        return {
            get hidden() {
                return document.hidden;
            },
            addListener: (f) => document.addEventListener('visibilitychange', f, false),
            removeListener: (f) => document.removeEventListener('visibilitychange', f, false),
        };
    }
    if (typeof document.msHidden !== 'undefined') {
        return {
            get hidden() {
                return document.msHidden;
            },
            addListener: (f) => document.addEventListener('msvisibilitychange', f, false),
            removeListener: (f) => document.removeEventListener('msvisibilitychange', f, false),
        };
    }
    if (typeof document.webkitHidden !== 'undefined') {
        return {
            get hidden() {
                return document.webkitHidden;
            },
            addListener: (f) => document.addEventListener('webkitvisibilitychange', f, false),
            removeListener: (f) => document.removeEventListener('webkitvisibilitychange', f, false),
        };
    }
    return {
        hidden: true,
        addListener: () => undefined,
        removeListener: () => undefined,
    };
})();
