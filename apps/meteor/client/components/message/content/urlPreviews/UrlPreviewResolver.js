"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const UrlAudioPreview_1 = __importDefault(require("./UrlAudioPreview"));
const UrlImagePreview_1 = __importDefault(require("./UrlImagePreview"));
const UrlVideoPreview_1 = __importDefault(require("./UrlVideoPreview"));
const UrlPreviewResolver = ({ url, type, originalType }) => {
    switch (type) {
        case 'audio':
            return (0, jsx_runtime_1.jsx)(UrlAudioPreview_1.default, { url: url });
        case 'video':
            return (0, jsx_runtime_1.jsx)(UrlVideoPreview_1.default, { url: url, originalType: originalType });
        case 'image':
            return (0, jsx_runtime_1.jsx)(UrlImagePreview_1.default, { url: url });
        default:
            return null;
    }
};
exports.default = UrlPreviewResolver;
