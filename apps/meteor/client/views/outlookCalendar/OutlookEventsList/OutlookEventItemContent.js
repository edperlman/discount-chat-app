"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const dompurify_1 = __importDefault(require("dompurify"));
const react_1 = __importDefault(require("react"));
const OutlookEventItemContent = ({ html, options }) => {
    const defaultOptions = {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'],
        ALLOWED_ATTR: ['href'],
    };
    const sanitize = (dirtyHTML, options) => ({
        __html: dompurify_1.default.sanitize(dirtyHTML, Object.assign(Object.assign({}, defaultOptions), options)).toString(),
    });
    return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { wordBreak: 'break-word', color: 'default', dangerouslySetInnerHTML: sanitize(html, options) });
};
exports.default = OutlookEventItemContent;
