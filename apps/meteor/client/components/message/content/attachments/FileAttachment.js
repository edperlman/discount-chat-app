"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = __importDefault(require("react"));
const AudioAttachment_1 = __importDefault(require("./file/AudioAttachment"));
const GenericFileAttachment_1 = __importDefault(require("./file/GenericFileAttachment"));
const ImageAttachment_1 = __importDefault(require("./file/ImageAttachment"));
const VideoAttachment_1 = __importDefault(require("./file/VideoAttachment"));
const FileAttachment = (attachment) => {
    if ((0, core_typings_1.isFileImageAttachment)(attachment)) {
        return (0, jsx_runtime_1.jsx)(ImageAttachment_1.default, Object.assign({}, attachment));
    }
    if ((0, core_typings_1.isFileAudioAttachment)(attachment)) {
        return (0, jsx_runtime_1.jsx)(AudioAttachment_1.default, Object.assign({}, attachment));
    }
    if ((0, core_typings_1.isFileVideoAttachment)(attachment)) {
        return (0, jsx_runtime_1.jsx)(VideoAttachment_1.default, Object.assign({}, attachment));
    }
    return (0, jsx_runtime_1.jsx)(GenericFileAttachment_1.default, Object.assign({}, attachment));
};
exports.default = FileAttachment;
