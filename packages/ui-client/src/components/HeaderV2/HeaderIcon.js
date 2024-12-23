"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const HeaderIcon = ({ icon }) => icon && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexShrink: 0, alignItems: 'center', overflow: 'hidden', justifyContent: 'center', children: (0, react_1.isValidElement)(icon) ? icon : (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { color: 'default', size: 'x20', name: icon.name }) }));
exports.default = HeaderIcon;
