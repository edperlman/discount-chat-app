"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const VideoConfPopupInfo = ({ avatar, icon, children }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [avatar, (icon || children) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexGrow: 1, flexShrink: 1, flexBasis: '0%', alignItems: 'center', mis: 8, withTruncatedText: true, children: [icon, (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 8, fontScale: 'h4', withTruncatedText: true, children: children })] }))] }));
exports.default = VideoConfPopupInfo;
