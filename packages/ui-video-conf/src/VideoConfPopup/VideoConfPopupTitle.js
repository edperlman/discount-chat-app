"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const VideoConfPopupTitle = ({ text, counter = false }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2b', children: text }), counter && (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x8', mis: 4 })] }));
exports.default = VideoConfPopupTitle;
