"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPreciseInterval = void 0;
const setPreciseInterval = (fn, duration) => {
    let timeoutId = undefined;
    const startTime = new Date().getTime();
    const run = () => {
        fn();
        const currentTime = new Date().getTime();
        let nextTick = duration - (currentTime - startTime);
        if (nextTick < 0) {
            nextTick = 0;
        }
        timeoutId = setTimeout(() => {
            run();
        }, nextTick);
    };
    run();
    return () => {
        timeoutId && clearTimeout(timeoutId);
    };
};
exports.setPreciseInterval = setPreciseInterval;
