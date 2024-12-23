"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PreviewChannelMentionElement = ({ mention }) => (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["#", mention] });
exports.default = (0, react_1.memo)(PreviewChannelMentionElement);
