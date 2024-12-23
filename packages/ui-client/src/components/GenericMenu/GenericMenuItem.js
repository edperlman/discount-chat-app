"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const GenericMenuItem = ({ icon, content, addon, status, gap, tooltip }) => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [gap && (0, jsx_runtime_1.jsx)(fuselage_1.MenuItemColumn, {}), icon && (0, jsx_runtime_1.jsx)(fuselage_1.MenuItemIcon, { name: icon }), status && (0, jsx_runtime_1.jsx)(fuselage_1.MenuItemColumn, { children: status }), content && (0, jsx_runtime_1.jsx)(fuselage_1.MenuItemContent, { title: tooltip, children: content }), addon && (0, jsx_runtime_1.jsx)(fuselage_1.MenuItemInput, { children: addon })] }));
exports.default = GenericMenuItem;
