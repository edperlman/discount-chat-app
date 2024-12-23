"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useComponentDidUpdate = void 0;
const react_1 = require("react");
const useComponentDidUpdate = (effect, dependencies = []) => {
    const hasMounted = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
};
exports.useComponentDidUpdate = useComponentDidUpdate;
