"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const SidebarTogglerBadge = ({ children }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: (0, css_in_js_1.css) `
			position: absolute;
			z-index: 3;
			top: -5px;
			right: 3px;
		`, children: (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { variant: 'danger', children: children }) }));
exports.default = SidebarTogglerBadge;
