"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const MessageComposerHint = ({ icon, children, helperText }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pbs: 0, pbe: 4, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Tag, { icon: icon ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { mie: 4, name: icon, size: 'x12' }) : undefined, children: children }), helperText && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'c1', color: 'font-hint', children: helperText }))] }));
exports.default = MessageComposerHint;
