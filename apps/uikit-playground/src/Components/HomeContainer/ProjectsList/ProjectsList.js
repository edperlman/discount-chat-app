"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const Context_1 = require("../../../Context");
const react_1 = require("react");
const ProjectsThumbnail_1 = __importDefault(require("./ProjectsThumbnail"));
const css_in_js_1 = require("@rocket.chat/css-in-js");
const ProjectsList = () => {
    const { state: { screens, projects }, } = (0, react_1.useContext)(Context_1.context);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: (0, css_in_js_1.css) `
        display: grid;
        grid-template-columns: repeat(auto-fill, 200px);
        gap: 30px;
      `, pbe: "30px", children: Object.values(projects).map((project) => ((0, jsx_runtime_1.jsx)(ProjectsThumbnail_1.default, { id: project.id, name: project.name, date: project.date, blocks: screens[project.screens[0]].payload.blocks }, project.id))) }));
};
exports.default = ProjectsList;
