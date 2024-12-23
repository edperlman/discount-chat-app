"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCallbackEventEmitter = exports.parentCall = void 0;
const widget_1 = require("../widget");
const parentCall = (method, ...args) => {
    const data = {
        src: 'rocketchat',
        fn: method,
        args,
    };
    // TODO: This lgtm ignoring deserves more attention urgently!
    window.parent.postMessage(data, '*'); // lgtm [js/cross-window-information-leak]
};
exports.parentCall = parentCall;
const runCallbackEventEmitter = (callbackName, data) => widget_1.VALID_CALLBACKS.includes(callbackName) && (0, exports.parentCall)('callback', callbackName, data);
exports.runCallbackEventEmitter = runCallbackEventEmitter;
