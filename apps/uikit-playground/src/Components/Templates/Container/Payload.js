"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const Context_1 = require("../../../Context");
const RenderPayload_1 = __importDefault(require("../../RenderPayload/RenderPayload"));
const getUniqueId_1 = __importDefault(require("../../../utils/getUniqueId"));
const SurfaceRender_1 = __importDefault(require("../../Preview/Display/Surface/SurfaceRender"));
const Payload = ({ blocks, surface, }) => {
    const { dispatch } = (0, react_1.useContext)(Context_1.context);
    const blocksWithUniqueIds = (0, react_1.useMemo)(() => blocks.map((block) => {
        return Object.assign(Object.assign({}, block), { actionId: (0, getUniqueId_1.default)() });
    }), [blocks]);
    const clickHandler = () => {
        dispatch((0, Context_1.templatesToggleAction)(false));
        dispatch((0, Context_1.updatePayloadAction)({
            blocks: blocksWithUniqueIds,
            changedByEditor: false,
        }));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { onClick: clickHandler, border: "1px solid #e6e6e6", padding: "4px", borderRadius: 12, className: (0, css_in_js_1.css) `
          cursor: pointer;
        `, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: (0, css_in_js_1.css) `
            pointer-events: none;
            &hover {
              box-shadow: var(--elements-box-shadow);
            }
          `, children: (0, jsx_runtime_1.jsx)(SurfaceRender_1.default, { type: surface, children: (0, jsx_runtime_1.jsx)(RenderPayload_1.default, { blocks: blocksWithUniqueIds, surface: surface }) }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: clickHandler, primary: true, mbs: '15px', mbe: '25px', children: "Use This Template" })] }));
};
exports.default = Payload;
