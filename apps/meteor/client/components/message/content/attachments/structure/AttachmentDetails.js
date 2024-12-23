"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const AttachmentDetails = (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ "rcx-attachment__details": true, fontScale: 'p2', color: 'hint', bg: 'surface-tint', padding: 16 }, props)));
exports.default = AttachmentDetails;
