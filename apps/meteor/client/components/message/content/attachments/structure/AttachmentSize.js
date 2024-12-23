"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const AttachmentTitle_1 = __importDefault(require("./AttachmentTitle"));
const useFormatMemorySize_1 = require("../../../../../hooks/useFormatMemorySize");
const AttachmentSize = (_a) => {
    var { size, wrapper = true } = _a, props = __rest(_a, ["size", "wrapper"]);
    const format = (0, useFormatMemorySize_1.useFormatMemorySize)();
    const formattedSize = wrapper ? `(${format(size)})` : format(size);
    return ((0, jsx_runtime_1.jsx)(AttachmentTitle_1.default, Object.assign({ flexShrink: 0 }, props, { children: formattedSize })));
};
exports.default = AttachmentSize;
