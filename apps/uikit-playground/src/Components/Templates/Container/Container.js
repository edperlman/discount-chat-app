"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const Section_1 = __importDefault(require("./Section"));
const Container = ({ templates }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: "800px", margin: "80px", width: '90%', height: "max-content", children: templates &&
        templates.map((template, i) => (0, jsx_runtime_1.jsx)(Section_1.default, { template: template, index: i })) }));
exports.default = Container;
