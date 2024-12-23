"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const InfoPanel = ({ children }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, mb: 'neg-x24', children: children }));
exports.default = InfoPanel;
