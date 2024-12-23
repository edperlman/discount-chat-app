"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const MarkdownText_1 = __importDefault(require("../../../../MarkdownText"));
const MessageCollapsible_1 = __importDefault(require("../../../MessageCollapsible"));
const MessageContentBody_1 = __importDefault(require("../../../MessageContentBody"));
const AudioAttachment = ({ title, audio_url: url, audio_type: type, audio_size: size, description, descriptionMd, title_link: link, title_link_download: hasDownload, collapsed, }) => {
    const getURL = (0, ui_contexts_1.useMediaUrl)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [descriptionMd ? (0, jsx_runtime_1.jsx)(MessageContentBody_1.default, { md: descriptionMd }) : (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { parseEmoji: true, content: description }), (0, jsx_runtime_1.jsx)(MessageCollapsible_1.default, { title: title, hasDownload: hasDownload, link: getURL(link || url), size: size, isCollapsed: collapsed, children: (0, jsx_runtime_1.jsx)(fuselage_1.AudioPlayer, { src: getURL(url), type: type }) })] }));
};
exports.default = AudioAttachment;
