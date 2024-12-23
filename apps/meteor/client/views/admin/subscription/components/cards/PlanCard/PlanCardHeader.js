"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const PlanCardHeader = ({ name }) => {
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'rocketchat', color: fuselage_1.Palette.badge['badge-background-level-4'].toString(), size: 'x28', mie: 4 }), (0, jsx_runtime_1.jsx)(fuselage_1.CardTitle, { variant: 'h3', children: name })] }));
};
exports.default = PlanCardHeader;
