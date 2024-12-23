"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionAttachment = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ActionAttachmentButton_1 = __importDefault(require("./ActionAttachmentButton"));
const useExternalLink_1 = require("../../../../../hooks/useExternalLink");
const ActionAttachment = ({ actions }) => {
    const handleLinkClick = (0, useExternalLink_1.useExternalLink)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { small: true, children: actions
                .filter(({ type, msg_in_chat_window: msgInChatWindow, url, image_url: image, text }) => type === 'button' && (image || text) && (url || msgInChatWindow))
                .map(({ text, url, msgId, msg, msg_processing_type: processingType = 'sendMessage', image_url: image }, index) => {
                const content = image ? (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', src: image, maxHeight: 200 }) : text;
                if (url) {
                    return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { role: 'link', onClick: () => handleLinkClick(url), small: true, children: content }, index));
                }
                return ((0, jsx_runtime_1.jsx)(ActionAttachmentButton_1.default, { processingType: processingType, msg: msg, mid: msgId, children: content }, index));
            }) }) }));
};
exports.ActionAttachment = ActionAttachment;
