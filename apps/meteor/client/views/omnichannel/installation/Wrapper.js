"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const Wrapper = (text) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontFamily: 'mono', alignSelf: 'center', fontScale: 'p2', style: { wordBreak: 'break-all' }, mie: 4, flexGrow: 1, withRichContent: true, children: (0, jsx_runtime_1.jsx)("pre", { children: (0, jsx_runtime_1.jsx)("code", { children: text }) }) }));
exports.default = Wrapper;
