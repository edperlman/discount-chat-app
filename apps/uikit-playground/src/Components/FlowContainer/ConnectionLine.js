"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ConnectionLine = ({ fromX, fromY, toX, toY, }) => ((0, jsx_runtime_1.jsxs)("g", { children: [(0, jsx_runtime_1.jsx)("path", { fill: "none", stroke: "#222", strokeWidth: 1.5, className: "animated", d: `M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}` }), (0, jsx_runtime_1.jsx)("circle", { cx: toX, cy: toY, fill: "#fff", r: 2, stroke: "#222", strokeWidth: 1.5 })] }));
exports.default = ConnectionLine;
