"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const Payload_1 = __importDefault(require("./Payload"));
const Section = ({ template, index, }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbs: "25px", width: "100%", children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: "5px", children: (0, jsx_runtime_1.jsx)(fuselage_1.Label, { fontSize: 24, fontWeight: 800, children: template.heading }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: "15px", children: (0, jsx_runtime_1.jsx)(fuselage_1.Label, { children: template.description }) }), template.payloads.map((payload) => ((0, jsx_runtime_1.jsx)(Payload_1.default, { blocks: payload.blocks, surface: payload.surface })))] }, index));
exports.default = Section;
