"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./PrototypeRender.scss");
const fuselage_1 = require("@rocket.chat/fuselage");
const RenderPayload_1 = __importDefault(require("../RenderPayload/RenderPayload"));
const SurfaceRender_1 = __importDefault(require("../Preview/Display/Surface/SurfaceRender"));
const css_in_js_1 = require("@rocket.chat/css-in-js");
const react_1 = require("react");
const PrototypeRender = ({ blocks, surface, flowEdges, activeActions, onSelectAction, }) => {
    const timerRef = (0, react_1.useRef)();
    const [glowActive, setGlowActive] = (0, react_1.useState)(false);
    const actionClickHandler = (id) => {
        const edge = flowEdges.find((edge) => edge.sourceHandle === id);
        if (edge)
            return onSelectAction(edge.target);
        clearTimeout(timerRef.current);
        setGlowActive(false);
        setTimeout(() => {
            setGlowActive(true);
        }, 0);
        timerRef.current = setTimeout(() => {
            setGlowActive(false);
        }, 1000);
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { h: "max-content", mb: 'auto', className: "rc-prototype-renderer", children: (0, jsx_runtime_1.jsx)(SurfaceRender_1.default, { type: surface, children: blocks.map((action, id) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: (0, css_in_js_1.css) `
              cursor: pointer;
            `, onClick: () => actionClickHandler(action.actionId), children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: "relative", w: "100%", h: "100%", className: (0, css_in_js_1.css) `
                pointer-events: none;
                user-select: none;
              `, children: [glowActive && activeActions.includes(action.actionId) && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: 'rc-prototype_action-glow' })), (0, jsx_runtime_1.jsx)(RenderPayload_1.default, { blocks: [action], surface: surface })] }) }, id))) }) }));
};
exports.default = PrototypeRender;
