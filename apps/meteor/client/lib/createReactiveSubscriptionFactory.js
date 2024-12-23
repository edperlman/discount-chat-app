"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReactiveSubscriptionFactory = void 0;
const tracker_1 = require("meteor/tracker");
const queueMicrotask_1 = require("./utils/queueMicrotask");
const createReactiveSubscriptionFactory = (computeCurrentValueWith) => (...args) => {
    const callbacks = new Set();
    let currentValue = computeCurrentValueWith(...args);
    const reactiveFn = () => {
        currentValue = computeCurrentValueWith(...args);
        (0, queueMicrotask_1.queueMicrotask)(() => {
            callbacks.forEach((callback) => {
                callback();
            });
        });
    };
    let computation;
    (0, queueMicrotask_1.queueMicrotask)(() => {
        computation = tracker_1.Tracker.autorun(reactiveFn);
    });
    return [
        (callback) => {
            callbacks.add(callback);
            return () => {
                callbacks.delete(callback);
                if (callbacks.size === 0) {
                    (0, queueMicrotask_1.queueMicrotask)(() => computation === null || computation === void 0 ? void 0 : computation.stop());
                }
            };
        },
        () => currentValue,
    ];
};
exports.createReactiveSubscriptionFactory = createReactiveSubscriptionFactory;
