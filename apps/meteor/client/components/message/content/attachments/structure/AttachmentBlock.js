"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const Attachment_1 = __importDefault(require("./Attachment"));
const AttachmentBlock = ({ pre, color = 'annotation', children }) => ((0, jsx_runtime_1.jsxs)(Attachment_1.default, { children: [pre, (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', pis: 16, borderRadius: 2, borderInlineStartStyle: 'solid', borderInlineStartWidth: 'default', borderInlineStartColor: color, children: children })] }));
exports.default = AttachmentBlock;
