"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAtBottom = isAtBottom;
function isAtBottom(element, scrollThreshold = 0) {
    return element.scrollTop + scrollThreshold >= element.scrollHeight - element.clientHeight;
}
