"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoField = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const InfoPanel_1 = require("../../../../../components/InfoPanel");
const InfoField = ({ label, info }) => ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: label }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: info })] }));
exports.InfoField = InfoField;
