"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ProjectsList_1 = __importDefault(require("./ProjectsList/ProjectsList"));
const react_1 = require("react");
const Context_1 = require("../../Context");
const CreateNewScreenButton_1 = __importDefault(require("../ScreenThumbnail/CreateNewScreenButton"));
const css_in_js_1 = require("@rocket.chat/css-in-js");
const HomeContainer = () => {
    const { dispatch } = (0, react_1.useContext)(Context_1.context);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { minWidth: "100%", display: "flex", justifyContent: "center", h: "var(--content-height)", pbs: '30px', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { width: 'max-content', minWidth: '70%', display: "flex", flexDirection: "column", className: (0, css_in_js_1.css) `
          gap: 30px;
        `, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Label, { fontScale: "h1", children: "Projects" }), (0, jsx_runtime_1.jsx)(fuselage_1.Label, { fontScale: "h3", children: "Start a new project" }), (0, jsx_runtime_1.jsx)(CreateNewScreenButton_1.default, { name: "plus", onClick: () => dispatch((0, Context_1.createNewProjectAction)()) }), (0, jsx_runtime_1.jsx)(fuselage_1.Label, { fontScale: "h4", children: "Existing Projects" }), (0, jsx_runtime_1.jsx)(ProjectsList_1.default, {})] }) }));
};
exports.default = HomeContainer;
