"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const toHexByte = (value) => value.toString(16).padStart(2, '0');
const PreviewColorElement = ({ r, g, b, a }) => {
    if (a === 255) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["#", toHexByte(r), toHexByte(g), toHexByte(b)] }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["#", toHexByte(r), toHexByte(g), toHexByte(b), toHexByte(a)] }));
};
exports.default = (0, react_1.memo)(PreviewColorElement);
