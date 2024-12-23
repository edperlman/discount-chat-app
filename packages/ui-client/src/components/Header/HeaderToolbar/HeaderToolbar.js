"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const toolbar_1 = require("@react-aria/toolbar");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const HeaderToolbar = (props) => {
    const ref = (0, react_1.useRef)(null);
    const { toolbarProps } = (0, toolbar_1.useToolbar)(props, ref);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, Object.assign({ role: 'toolbar', ref: ref }, toolbarProps, { children: props.children })));
};
exports.default = HeaderToolbar;
