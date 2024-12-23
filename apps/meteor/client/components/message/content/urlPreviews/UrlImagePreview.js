"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const useOembedLayout_1 = require("../../hooks/useOembedLayout");
const UrlImagePreview = ({ url }) => {
    const { maxHeight: oembedMaxHeight } = (0, useOembedLayout_1.useOembedLayout)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxHeight: oembedMaxHeight, maxWidth: '100%', children: (0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreviewImage, { "data-id": url, className: 'preview-image', url: url || '', alt: '' }) }));
};
exports.default = UrlImagePreview;
