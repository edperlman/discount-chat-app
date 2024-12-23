"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navbar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const Navbar = ({ children }) => {
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { "aria-label": 'main-navigation', bg: 'surface-tint', is: 'nav', pb: 16, pi: 14, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { large: true, role: 'menubar', is: 'ul', vertical: true, children: children }) }));
};
exports.Navbar = Navbar;
