"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsVisible = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const useIsVisible = () => {
    const [menuVisibility, setMenuVisibility] = (0, fuselage_hooks_1.useSafely)((0, fuselage_hooks_1.useDebouncedState)(!!window.DISABLE_ANIMATION, 100));
    const callbackRef = (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setMenuVisibility(entry.isIntersecting);
            });
        });
        observer.observe(node);
    }, [setMenuVisibility]);
    return [callbackRef, menuVisibility];
};
exports.useIsVisible = useIsVisible;
