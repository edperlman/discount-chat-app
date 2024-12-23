"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipComponent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const TooltipComponent = ({ title, anchor }) => {
    const ref = (0, react_1.useRef)(anchor);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.PositionAnimated, { anchor: ref, placement: 'top-middle', margin: 8, visible: fuselage_1.AnimatedVisibility.UNHIDING, children: (0, jsx_runtime_1.jsx)(fuselage_1.Tooltip, { role: 'tooltip', children: title }) }));
};
exports.TooltipComponent = TooltipComponent;
