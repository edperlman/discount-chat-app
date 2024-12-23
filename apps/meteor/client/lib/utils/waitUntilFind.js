"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitUntilFind = void 0;
const tracker_1 = require("meteor/tracker");
const waitUntilFind = (fn) => new Promise((resolve) => {
    tracker_1.Tracker.autorun((c) => {
        const result = fn();
        if (result === undefined) {
            return;
        }
        c.stop();
        resolve(result);
    });
});
exports.waitUntilFind = waitUntilFind;
