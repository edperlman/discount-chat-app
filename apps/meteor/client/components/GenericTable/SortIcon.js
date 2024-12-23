"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const SortIcon = ({ direction }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'svg', width: 'x16', height: 'x16', viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [(0, jsx_runtime_1.jsx)("path", { d: 'M5.33337 5.99999L8.00004 3.33333L10.6667 5.99999', stroke: direction === 'desc' ? '#9EA2A8' : '#E4E7EA', strokeWidth: '1.33333', strokeLinecap: 'round', strokeLinejoin: 'round' }), (0, jsx_runtime_1.jsx)("path", { d: 'M5.33337 10L8.00004 12.6667L10.6667 10', stroke: direction === 'asc' ? '#9EA2A8' : '#E4E7EA', strokeWidth: '1.33333', strokeLinecap: 'round', strokeLinejoin: 'round' })] }));
exports.default = SortIcon;
