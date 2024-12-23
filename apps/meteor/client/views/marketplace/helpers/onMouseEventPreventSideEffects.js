"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMouseEventPreventSideEffects = void 0;
const onMouseEventPreventSideEffects = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
};
exports.onMouseEventPreventSideEffects = onMouseEventPreventSideEffects;
