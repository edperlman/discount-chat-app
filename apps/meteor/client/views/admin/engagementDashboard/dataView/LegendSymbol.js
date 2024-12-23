"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const LegendSymbol = ({ color = 'currentColor' }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inlineEnd: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', "aria-hidden": 'true', style: {
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: 2,
            backgroundColor: color,
            verticalAlign: 'baseline',
        } }) }));
exports.default = LegendSymbol;
