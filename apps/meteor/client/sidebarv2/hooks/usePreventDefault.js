"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreventDefault = void 0;
const react_1 = require("react");
const usePreventDefault = (ref) => {
    // Flowrouter uses an addEventListener on the document to capture any clink link, since the react synthetic event use an addEventListener on the document too,
    // it is impossible/hard to determine which one will happen before and prevent/stop propagation, so feel free to remove this effect after remove flow router :)
    (0, react_1.useEffect)(() => {
        const { current } = ref;
        const stopPropagation = (e) => {
            var _a;
            if ([e.target.nodeName, (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.nodeName].includes('BUTTON')) {
                e.preventDefault();
            }
        };
        current === null || current === void 0 ? void 0 : current.addEventListener('click', stopPropagation);
        return () => current === null || current === void 0 ? void 0 : current.addEventListener('click', stopPropagation);
    }, [ref]);
    return { ref };
};
exports.usePreventDefault = usePreventDefault;
