"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventSyntheticEvent = void 0;
const preventSyntheticEvent = (e) => {
    if (e) {
        (e.nativeEvent || e).stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    }
};
exports.preventSyntheticEvent = preventSyntheticEvent;
