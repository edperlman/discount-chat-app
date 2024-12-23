"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const Wrapper = ({ children }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pbs: "80px", pis: '50px', display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", verticalAlign: "middle", children: children, height: "max-content", width: "100%" }));
exports.default = Wrapper;
