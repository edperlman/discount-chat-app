"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const Context_1 = require("../../Context");
const templates_1 = require("../../utils/templates");
const Container_1 = __importDefault(require("./Container"));
const Templates = () => {
    const { state: { templatesToggle }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: templatesToggle && ((0, jsx_runtime_1.jsx)(fuselage_1.Scrollable, { vertical: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: "absolute", width: '100%', height: '100%', display: "flex", justifyContent: "center", alignItems: "flex-start", bg: "white", zIndex: 100, overflow: "auto", className: (0, css_in_js_1.css) `
              top: 0;
              left: 0;
            `, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { position: "fixed", square: true, className: (0, css_in_js_1.css) `
                top: 80px;
                right: 40px;
              `, onClick: () => dispatch((0, Context_1.templatesToggleAction)(false)), children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: "cross", size: "x15" }) }), (0, jsx_runtime_1.jsx)(Container_1.default, { templates: templates_1.templates })] }) })) }));
};
exports.default = Templates;
