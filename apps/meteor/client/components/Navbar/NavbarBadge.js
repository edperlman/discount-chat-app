"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavbarBadge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const NavbarBadge = (props) => {
    return ((0, jsx_runtime_1.jsx)("div", { style: { top: -5, right: -5, position: 'absolute' }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Badge, Object.assign({}, props)) }));
};
exports.NavbarBadge = NavbarBadge;
