"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const Growth_1 = __importDefault(require("./Growth"));
const Counter = ({ count, variation = 0, description }) => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { alignItems: 'end', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', color: 'default', fontScale: 'h2', style: {
                            fontSize: '3em',
                            lineHeight: 1,
                        }, children: count }), (0, jsx_runtime_1.jsx)(Growth_1.default, { fontScale: 'h4', children: variation })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { block: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { alignItems: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', color: 'hint', children: description }) }) })] }));
exports.default = Counter;
