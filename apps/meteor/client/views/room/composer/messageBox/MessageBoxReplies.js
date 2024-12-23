"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const shim_1 = require("use-sync-external-store/shim");
const getUserDisplayName_1 = require("../../../../../lib/getUserDisplayName");
const QuoteAttachment_1 = require("../../../../components/message/content/attachments/QuoteAttachment");
const AttachmentProvider_1 = __importDefault(require("../../../../providers/AttachmentProvider"));
const ChatContext_1 = require("../../contexts/ChatContext");
const MessageBoxReplies = () => {
    var _a;
    const chat = (0, ChatContext_1.useChat)();
    if (!((_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.quotedMessages)) {
        throw new Error('Chat context not found');
    }
    const replies = (0, shim_1.useSyncExternalStore)(chat.composer.quotedMessages.subscribe, chat.composer.quotedMessages.get);
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    if (!replies.length) {
        return null;
    }
    const closeWrapperStyle = (0, css_in_js_1.css) `
		position: absolute;
		right: 0.5rem;
		top: 0.75rem;
	`;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 8, position: 'relative', overflowY: 'auto', maxHeight: 'x256', children: replies.map((reply, key) => {
            var _a;
            return ((0, jsx_runtime_1.jsx)(fuselage_1.Margins, { block: 4, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', position: 'relative', children: [(0, jsx_runtime_1.jsx)(AttachmentProvider_1.default, { children: (0, jsx_runtime_1.jsx)(QuoteAttachment_1.QuoteAttachment, { attachment: {
                                    text: reply.msg,
                                    md: reply.md,
                                    author_name: reply.alias || (0, getUserDisplayName_1.getUserDisplayName)(reply.u.name, reply.u.username, useRealName),
                                    author_icon: `/avatar/${reply.u.username}`,
                                    ts: reply.ts,
                                    attachments: (_a = reply === null || reply === void 0 ? void 0 : reply.attachments) === null || _a === void 0 ? void 0 : _a.map((obj) => (Object.assign(Object.assign({}, obj), { collapsed: true }))),
                                    collapsed: true,
                                } }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: closeWrapperStyle, "data-mid": reply._id, onClick: () => {
                                var _a;
                                (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.dismissQuotedMessage(reply._id);
                            }, children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { mini: true, icon: 'cross' }) })] }) }, key));
        }) }));
};
exports.default = (0, react_1.memo)(MessageBoxReplies);
