"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const DotLeader_1 = require("./DotLeader");
const TextSeparator = ({ label, value }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', mb: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'inline-flex', alignItems: 'center', children: label }), (0, jsx_runtime_1.jsx)(DotLeader_1.DotLeader, {}), (0, jsx_runtime_1.jsx)("span", { children: value })] }));
exports.default = TextSeparator;
