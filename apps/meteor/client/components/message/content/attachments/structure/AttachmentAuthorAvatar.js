"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importDefault(require("react"));
const AttachmentAuthorAvatar = ({ url }) => (0, jsx_runtime_1.jsx)(ui_avatar_1.BaseAvatar, { url: url, size: 'x24' });
exports.default = AttachmentAuthorAvatar;
