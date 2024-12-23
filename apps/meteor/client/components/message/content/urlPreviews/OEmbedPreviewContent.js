"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const MarkdownText_1 = __importDefault(require("../../../MarkdownText"));
const OEmbedPreviewContent = ({ title, description, url, thumb, authorName, authorUrl, siteName, siteUrl, }) => {
    const showSiteName = siteName && siteUrl;
    const showAuthorName = authorName && authorUrl;
    const showFooterSeparator = showSiteName && showAuthorName;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageGenericPreviewContent, { thumb: thumb, children: [title && ((0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreviewTitle, { externalUrl: url, title: title, children: title })), description && (0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreviewDescription, { children: description }), (showSiteName || showAuthorName) && ((0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreviewFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', justifyContent: 'flex-start', children: [showSiteName && (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: `[${siteName}](${siteUrl})` }), showFooterSeparator && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginInline: 4, children: "|" }), showAuthorName && (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: `[${authorName}](${authorUrl})` })] }) }))] }));
};
exports.default = OEmbedPreviewContent;
