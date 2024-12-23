"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteAttachment = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const useTimeAgo_1 = require("../../../../hooks/useTimeAgo");
const MessageContentBody_1 = __importDefault(require("../../MessageContentBody"));
const Attachments_1 = __importDefault(require("../Attachments"));
const AttachmentAuthor_1 = __importDefault(require("./structure/AttachmentAuthor"));
const AttachmentAuthorAvatar_1 = __importDefault(require("./structure/AttachmentAuthorAvatar"));
const AttachmentAuthorName_1 = __importDefault(require("./structure/AttachmentAuthorName"));
const AttachmentContent_1 = __importDefault(require("./structure/AttachmentContent"));
const AttachmentDetails_1 = __importDefault(require("./structure/AttachmentDetails"));
const AttachmentInner_1 = __importDefault(require("./structure/AttachmentInner"));
// TODO: remove this team collaboration
const quoteStyles = (0, css_in_js_1.css) `
	.rcx-attachment__details {
		.rcx-message-body {
			color: ${fuselage_1.Palette.text['font-hint']};
		}
	}
	&:hover,
	&:focus {
		.rcx-attachment__details {
			background: ${fuselage_1.Palette.surface['surface-hover']};
			border-color: ${fuselage_1.Palette.stroke['stroke-light']};
			border-inline-start-color: ${fuselage_1.Palette.stroke['stroke-medium']};
		}
	}
`;
const QuoteAttachment = ({ attachment }) => {
    var _a;
    const formatTime = (0, useTimeAgo_1.useTimeAgo)();
    const displayAvatarPreference = (0, ui_contexts_1.useUserPreference)('displayAvatars');
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(AttachmentContent_1.default, { className: quoteStyles, width: 'full', children: (0, jsx_runtime_1.jsxs)(AttachmentDetails_1.default, { is: 'blockquote', borderRadius: 'x2', borderWidth: 'default', borderStyle: 'solid', borderColor: 'extra-light', borderInlineStartColor: 'light', children: [(0, jsx_runtime_1.jsxs)(AttachmentAuthor_1.default, { children: [displayAvatarPreference && (0, jsx_runtime_1.jsx)(AttachmentAuthorAvatar_1.default, { url: attachment.author_icon }), (0, jsx_runtime_1.jsx)(AttachmentAuthorName_1.default, Object.assign({}, (attachment.author_link && { is: 'a', href: attachment.author_link, target: '_blank', color: 'hint' }), { children: attachment.author_name })), attachment.ts && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ fontScale: 'c1' }, (attachment.message_link ? { is: 'a', href: attachment.message_link, color: 'hint' } : { color: 'hint' }), { children: formatTime(attachment.ts) })))] }), attachment.attachments && ((0, jsx_runtime_1.jsx)(AttachmentInner_1.default, { children: (0, jsx_runtime_1.jsx)(Attachments_1.default, { attachments: attachment.attachments, id: (_a = attachment.attachments[0]) === null || _a === void 0 ? void 0 : _a.title_link }) })), attachment.md ? (0, jsx_runtime_1.jsx)(MessageContentBody_1.default, { md: attachment.md }) : attachment.text.substring(attachment.text.indexOf('\n') + 1)] }) }) }));
};
exports.QuoteAttachment = QuoteAttachment;
