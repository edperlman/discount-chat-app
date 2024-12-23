"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotLeader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const DotLeader = ({ color = 'neutral-300', dotSize = 'x2' }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, h: 'full', alignSelf: 'flex-end', borderBlockEndStyle: 'dotted', borderBlockEndWidth: dotSize, m: 2, borderColor: color }));
exports.DotLeader = DotLeader;
