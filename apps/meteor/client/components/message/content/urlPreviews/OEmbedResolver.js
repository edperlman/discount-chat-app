"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const OEmbedHtmlPreview_1 = __importDefault(require("./OEmbedHtmlPreview"));
const OEmbedImagePreview_1 = __importDefault(require("./OEmbedImagePreview"));
const OEmbedLinkPreview_1 = __importDefault(require("./OEmbedLinkPreview"));
const OEmbedResolver = ({ meta }) => {
    switch (meta.type) {
        case 'rich':
        case 'video':
            return (0, jsx_runtime_1.jsx)(OEmbedHtmlPreview_1.default, Object.assign({}, meta));
        case 'photo':
            return (0, jsx_runtime_1.jsx)(OEmbedImagePreview_1.default, Object.assign({}, meta));
        default:
            return (0, jsx_runtime_1.jsx)(OEmbedLinkPreview_1.default, Object.assign({}, meta));
    }
};
exports.default = OEmbedResolver;
