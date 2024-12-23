"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const InfoPanelSection_1 = __importDefault(require("./InfoPanelSection"));
const InfoPanelAvatar = ({ children }) => ((0, jsx_runtime_1.jsx)(InfoPanelSection_1.default, { display: 'flex', justifyContent: 'center', children: children }));
exports.default = InfoPanelAvatar;
