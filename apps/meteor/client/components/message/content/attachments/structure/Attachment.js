"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const className = (0, css_in_js_1.css) `
	white-space: normal;
`;
const Attachment = (props) => {
    const { width } = (0, ui_contexts_1.useAttachmentDimensions)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ "rcx-message-attachment": true, mb: 4, maxWidth: width, width: 'full', display: 'flex', overflow: 'hidden', flexDirection: 'column', className: className }, props)));
};
exports.default = Attachment;
