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
exports.FileAttachment = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const compat_1 = require("preact/compat");
const createClassName_1 = require("../../../helpers/createClassName");
const download_svg_1 = __importDefault(require("../../../icons/download.svg"));
const FileAttachmentIcon_1 = require("../FileAttachmentIcon");
const MessageBubble_1 = require("../MessageBubble");
const styles_scss_1 = __importDefault(require("./styles.scss"));
exports.FileAttachment = (0, compat_1.memo)((_a) => {
    var { url, title, className } = _a, messageBubbleProps = __rest(_a, ["url", "title", "className"]);
    return ((0, jsx_runtime_1.jsx)(MessageBubble_1.MessageBubble, Object.assign({ className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'file-attachment', {}, [className]) }, messageBubbleProps, { children: (0, jsx_runtime_1.jsxs)("a", { href: url, download: true, target: '_blank', rel: 'noopener noreferrer', className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'file-attachment__inner'), children: [(0, jsx_runtime_1.jsx)(FileAttachmentIcon_1.FileAttachmentIcon, { url: url }), (0, jsx_runtime_1.jsx)("span", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'file-attachment__title'), children: title }), (0, jsx_runtime_1.jsx)(download_svg_1.default, { width: 20, height: 20, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'file-attachment__download-button') })] }) })));
});
