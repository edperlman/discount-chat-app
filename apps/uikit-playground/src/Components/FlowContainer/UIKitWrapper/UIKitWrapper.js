"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
require("./UIKitWrapper.scss");
const RenderPayload_1 = __importDefault(require("../../RenderPayload/RenderPayload"));
const SurfaceRender_1 = __importDefault(require("../../Preview/Display/Surface/SurfaceRender"));
const Context_1 = require("../../../Context");
const UIKitWrapper = ({ id, data }) => {
    const { state: { screens }, } = (0, react_1.useContext)(Context_1.context);
    if (!screens[data])
        return null;
    const { blocks, surface } = screens[data].payload;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { padding: "10px", border: "var(--default-border)", bg: "white", borderRadius: '10px', children: [(0, jsx_runtime_1.jsx)(reactflow_1.Handle, { type: "target", className: 'react-flow-targetHandle', position: reactflow_1.Position.Left, id: `${id}` }), (0, jsx_runtime_1.jsx)(SurfaceRender_1.default, { type: surface, children: blocks.map((block, index) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pie: "6px", className: "uiKitWrapper", children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: "relative", border: "var(--default-border)", padding: "10px", children: [(0, jsx_runtime_1.jsx)(RenderPayload_1.default, { blocks: [block], surface: surface }), (0, jsx_runtime_1.jsx)(reactflow_1.Handle, { type: "source", className: "react-flow-sourceHandle", position: reactflow_1.Position.Right, id: block.actionId })] }) }, index))) })] }));
};
exports.default = UIKitWrapper;
