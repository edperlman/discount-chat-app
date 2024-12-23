"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const Extensions_1 = require("../../CodeEditor/Extensions/Extensions");
const PreviewEditor_1 = __importDefault(require("../../CodeEditor/PreviewEditor"));
const ActionPreviewEditor = () => ((0, jsx_runtime_1.jsx)(fuselage_1.Scrollable, { vertical: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: "relative", height: '100%', width: '100%', zIndex: 1, bg: '#f6f9fc', display: 'flex', borderInlineStart: 'var(--default-border)', overflow: 'auto', children: (0, jsx_runtime_1.jsx)(PreviewEditor_1.default, { extensions: Extensions_1.actionPreviewExtensions }) }) }));
exports.default = ActionPreviewEditor;
