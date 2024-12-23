"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const HeaderState = (props) => (props.onClick ? (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, Object.assign({ mini: true }, props)) : (0, jsx_runtime_1.jsx)(fuselage_1.Icon, Object.assign({ size: 'x16', name: props.icon }, props)));
exports.default = HeaderState;
