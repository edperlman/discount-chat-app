"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePreviewType = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const GenericPreview_1 = __importDefault(require("./GenericPreview"));
const MediaPreview_1 = __importDefault(require("./MediaPreview"));
const isIE11_1 = require("../../../../lib/utils/isIE11");
var FilePreviewType;
(function (FilePreviewType) {
    FilePreviewType["IMAGE"] = "image";
    FilePreviewType["AUDIO"] = "audio";
    FilePreviewType["VIDEO"] = "video";
})(FilePreviewType || (exports.FilePreviewType = FilePreviewType = {}));
const getFileType = (fileType) => {
    if (!fileType) {
        return;
    }
    for (const type of Object.values(FilePreviewType)) {
        if (fileType.indexOf(type) > -1) {
            return type;
        }
    }
};
const shouldShowMediaPreview = (file, fileType) => {
    if (!fileType) {
        return false;
    }
    if (isIE11_1.isIE11) {
        return false;
    }
    // Avoid preview if file size bigger than 10mb
    if (file.size > 10000000) {
        return false;
    }
    if (!Object.values(FilePreviewType).includes(fileType)) {
        return false;
    }
    return true;
};
const FilePreview = ({ file }) => {
    const fileType = getFileType(file.type);
    if (shouldShowMediaPreview(file, fileType)) {
        return (0, jsx_runtime_1.jsx)(MediaPreview_1.default, { file: file, fileType: fileType });
    }
    return (0, jsx_runtime_1.jsx)(GenericPreview_1.default, { file: file });
};
exports.default = FilePreview;
