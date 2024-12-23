"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageBoxAutoFocus = void 0;
const react_1 = require("react");
/**
 * if the user is types outside the message box and its not actually typing in any input field
 * then the message box should be focused
 * @returns callbackRef to bind the logic to the message box
 */
const useMessageBoxAutoFocus = (enabled) => {
    const ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            const { current: node } = ref;
            const { target } = e;
            if (!target) {
                return;
            }
            if (target === node) {
                return;
            }
            if (!((e.keyCode > 45 && e.keyCode < 91) || e.keyCode === 8)) {
                return;
            }
            if (/input|textarea|select/i.test(target.tagName)) {
                return;
            }
            if (e.ctrlKey === true || e.metaKey === true) {
                return;
            }
            node === null || node === void 0 ? void 0 : node.focus();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        ref.current = node;
        if (!enabled) {
            return;
        }
        if (ref.current) {
            ref.current.focus();
        }
    }, [enabled, ref]);
};
exports.useMessageBoxAutoFocus = useMessageBoxAutoFocus;
