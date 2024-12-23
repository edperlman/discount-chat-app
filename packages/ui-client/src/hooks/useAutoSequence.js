"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoSequence = void 0;
const react_1 = require("react");
const useAutoSequence = (sequence, delay = 700) => {
    const [index, setIndex] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => setIndex((index) => index + 1), delay);
        return () => {
            clearInterval(timer);
        };
    }, [delay]);
    return sequence[index % sequence.length];
};
exports.useAutoSequence = useAutoSequence;
