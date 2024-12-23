"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBodyPosition = void 0;
const react_1 = require("react");
const useBodyPosition = (position, enabled = true) => {
    (0, react_1.useEffect)(() => {
        if (!enabled) {
            return;
        }
        const previous = document.body.style.position;
        document.body.style.position = position;
        return () => {
            document.body.style.position = previous;
        };
    }, [position, enabled]);
};
exports.useBodyPosition = useBodyPosition;
