"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearHighlightMessage = exports.setHighlightMessage = exports.subscribe = exports.getSnapshot = void 0;
const createMessageHighlightSubscription = () => {
    let updateCb = () => undefined;
    let highlightMessageId;
    const subscribe = (cb) => {
        updateCb = cb;
        return () => {
            updateCb = () => undefined;
        };
    };
    const getSnapshot = () => highlightMessageId;
    const setHighlight = (_id) => {
        highlightMessageId = _id;
        updateCb();
    };
    const clearHighlight = () => {
        highlightMessageId = undefined;
        updateCb();
    };
    return { subscribe, getSnapshot, setHighlight, clearHighlight };
};
_a = createMessageHighlightSubscription(), exports.getSnapshot = _a.getSnapshot, exports.subscribe = _a.subscribe, exports.setHighlightMessage = _a.setHighlight, exports.clearHighlightMessage = _a.clearHighlight;
