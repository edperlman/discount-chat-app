"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const MessageSurface = ({ children }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Banner, { icon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: "info", size: "x20" }), children: children }));
exports.default = MessageSurface;
