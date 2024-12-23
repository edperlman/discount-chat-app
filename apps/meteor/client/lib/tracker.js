"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asReactiveSource = void 0;
const tracker_1 = require("meteor/tracker");
const asReactiveSource = (subscribe, getSnapshot) => {
    if (!tracker_1.Tracker.active) {
        return getSnapshot();
    }
    const computation = tracker_1.Tracker.currentComputation;
    const unsubscribe = subscribe(() => computation === null || computation === void 0 ? void 0 : computation.invalidate());
    computation === null || computation === void 0 ? void 0 : computation.onInvalidate(() => {
        unsubscribe();
    });
    return getSnapshot();
};
exports.asReactiveSource = asReactiveSource;
