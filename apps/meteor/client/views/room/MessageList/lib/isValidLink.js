"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidLink = void 0;
const isValidLink = (link) => {
    try {
        return Boolean(new URL(link));
    }
    catch (error) {
        return false;
    }
};
exports.isValidLink = isValidLink;
