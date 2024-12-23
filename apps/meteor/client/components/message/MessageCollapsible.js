"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const AttachmentDownload_1 = __importDefault(require("./content/attachments/structure/AttachmentDownload"));
const AttachmentSize_1 = __importDefault(require("./content/attachments/structure/AttachmentSize"));
const useCollapse_1 = require("./hooks/useCollapse");
const MessageCollapsible = ({ children, title, hasDownload, link, size, isCollapsed }) => {
    const [collapsed, collapse] = (0, useCollapse_1.useCollapse)(isCollapsed);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', color: 'hint', fontScale: 'c1', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, title: title, children: title }), size && (0, jsx_runtime_1.jsx)(AttachmentSize_1.default, { size: size }), " ", collapse, hasDownload && link && (0, jsx_runtime_1.jsx)(AttachmentDownload_1.default, { title: title, href: link })] }), !collapsed && children] }));
};
exports.default = MessageCollapsible;
