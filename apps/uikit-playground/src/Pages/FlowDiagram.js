"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const FlowContainer_1 = __importDefault(require("../Components/FlowContainer/FlowContainer"));
const reactflow_1 = require("reactflow");
const FlowDiagram = () => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: "100%", h: "100%", position: "relative", children: (0, jsx_runtime_1.jsx)(reactflow_1.ReactFlowProvider, { children: (0, jsx_runtime_1.jsx)(FlowContainer_1.default, {}) }) }));
exports.default = FlowDiagram;
