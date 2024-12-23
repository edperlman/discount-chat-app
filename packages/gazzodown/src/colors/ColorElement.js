"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ColorElement = ({ r, g, b, a }) => ((0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)("span", { style: {
                backgroundColor: `rgba(${r}, ${g}, ${b}, ${(a / 255) * 100}%)`,
                display: 'inline-block',
                width: '1em',
                height: '1em',
                verticalAlign: 'middle',
                marginInlineEnd: '0.5em',
            } }), "rgba(", r, ", ", g, ", ", b, ", ", (a / 255) * 100, "%)"] }));
exports.default = (0, react_1.memo)(ColorElement);
