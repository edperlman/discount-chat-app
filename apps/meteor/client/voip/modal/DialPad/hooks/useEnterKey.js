"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnterKey = void 0;
const react_1 = require("react");
const useEnterKey = (onEnter, disabled) => {
    (0, react_1.useEffect)(() => {
        const sendOnEnter = (e) => {
            if (e.key !== 'Enter' || disabled) {
                return;
            }
            e.stopPropagation();
            onEnter();
        };
        window.addEventListener('keydown', sendOnEnter);
        return () => {
            window.removeEventListener('keydown', sendOnEnter);
        };
    }, [disabled, onEnter]);
};
exports.useEnterKey = useEnterKey;
