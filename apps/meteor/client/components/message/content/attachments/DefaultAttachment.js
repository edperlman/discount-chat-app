"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = __importDefault(require("react"));
const ActionAttachtment_1 = require("./default/ActionAttachtment");
const FieldsAttachment_1 = __importDefault(require("./default/FieldsAttachment"));
const AttachmentAuthor_1 = __importDefault(require("./structure/AttachmentAuthor"));
const AttachmentAuthorAvatar_1 = __importDefault(require("./structure/AttachmentAuthorAvatar"));
const AttachmentAuthorName_1 = __importDefault(require("./structure/AttachmentAuthorName"));
const AttachmentBlock_1 = __importDefault(require("./structure/AttachmentBlock"));
const AttachmentContent_1 = __importDefault(require("./structure/AttachmentContent"));
const AttachmentImage_1 = __importDefault(require("./structure/AttachmentImage"));
const AttachmentRow_1 = __importDefault(require("./structure/AttachmentRow"));
const AttachmentText_1 = __importDefault(require("./structure/AttachmentText"));
const AttachmentThumb_1 = __importDefault(require("./structure/AttachmentThumb"));
const AttachmentTitle_1 = __importDefault(require("./structure/AttachmentTitle"));
const MarkdownText_1 = __importDefault(require("../../../MarkdownText"));
const useCollapse_1 = require("../../hooks/useCollapse");
const applyMarkdownIfRequires = (list = ['text', 'pretext'], key, text, variant = 'inline') => ((list === null || list === void 0 ? void 0 : list.includes(key)) ? (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { parseEmoji: true, variant: variant, content: text }) : text);
const DefaultAttachment = (attachment) => {
    const [collapsed, collapse] = (0, useCollapse_1.useCollapse)(!!attachment.collapsed);
    return ((0, jsx_runtime_1.jsxs)(AttachmentBlock_1.default, { color: attachment.color, pre: attachment.pretext && ((0, jsx_runtime_1.jsx)(AttachmentText_1.default, { children: applyMarkdownIfRequires(attachment.mrkdwn_in, 'pretext', attachment.pretext) })), children: [(0, jsx_runtime_1.jsxs)(AttachmentContent_1.default, { children: [attachment.author_name && ((0, jsx_runtime_1.jsxs)(AttachmentAuthor_1.default, { children: [attachment.author_icon && (0, jsx_runtime_1.jsx)(AttachmentAuthorAvatar_1.default, { url: attachment.author_icon }), (0, jsx_runtime_1.jsx)(AttachmentAuthorName_1.default, Object.assign({}, (attachment.author_link && {
                                is: 'a',
                                href: attachment.author_link,
                                target: '_blank',
                                color: undefined,
                            }), { children: attachment.author_name }))] })), attachment.title && ((0, jsx_runtime_1.jsxs)(AttachmentRow_1.default, { children: [(0, jsx_runtime_1.jsx)(AttachmentTitle_1.default, Object.assign({}, (attachment.title_link && {
                                is: 'a',
                                href: attachment.title_link,
                                target: '_blank',
                                color: undefined,
                            }), { children: attachment.title })), ' ', collapse] })), !collapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [attachment.text && ((0, jsx_runtime_1.jsx)(AttachmentText_1.default, { children: applyMarkdownIfRequires(attachment.mrkdwn_in, 'text', attachment.text, 'document') })), attachment.fields && ((0, jsx_runtime_1.jsx)(FieldsAttachment_1.default, { fields: attachment.fields.map((field) => {
                                    if (!field.value) {
                                        return field;
                                    }
                                    const { value, title } = field, rest = __rest(field, ["value", "title"]);
                                    return Object.assign(Object.assign({}, rest), { title: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', parseEmoji: true, content: title.replace(/(.*)/g, (line) => `${line}  `) }), value: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', parseEmoji: true, content: value.replace(/(.*)/g, (line) => `${line}  `) }) });
                                }) })), attachment.image_url && (0, jsx_runtime_1.jsx)(AttachmentImage_1.default, Object.assign({}, attachment.image_dimensions, { src: attachment.image_url })), (0, core_typings_1.isActionAttachment)(attachment) && (0, jsx_runtime_1.jsx)(ActionAttachtment_1.ActionAttachment, Object.assign({}, attachment))] }))] }), attachment.thumb_url && (0, jsx_runtime_1.jsx)(AttachmentThumb_1.default, { url: attachment.thumb_url })] }));
};
exports.default = DefaultAttachment;
