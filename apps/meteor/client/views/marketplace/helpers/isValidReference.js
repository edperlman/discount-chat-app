"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidReference = void 0;
const isValidReference = (reference, e) => {
    var _a;
    const isValidTarget = Boolean(e.target);
    const isValidReference = e.target !== reference.current && !((_a = reference.current) === null || _a === void 0 ? void 0 : _a.contains(e.target));
    return isValidTarget && isValidReference;
};
exports.isValidReference = isValidReference;
