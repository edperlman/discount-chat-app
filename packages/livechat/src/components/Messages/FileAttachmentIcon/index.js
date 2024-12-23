"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAttachmentIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const compat_1 = require("preact/compat");
const doc_svg_1 = __importDefault(require("../../../icons/doc.svg"));
const file_svg_1 = __importDefault(require("../../../icons/file.svg"));
const pdf_svg_1 = __importDefault(require("../../../icons/pdf.svg"));
const ppt_svg_1 = __importDefault(require("../../../icons/ppt.svg"));
const sheet_svg_1 = __importDefault(require("../../../icons/sheet.svg"));
const zip_svg_1 = __importDefault(require("../../../icons/zip.svg"));
exports.FileAttachmentIcon = (0, compat_1.memo)(({ url }) => {
    const extension = url ? url.split('.').pop() : null;
    const Icon = extension &&
        ((/pdf/i.test(extension) && pdf_svg_1.default) ||
            (/doc|docx|rtf|txt|odt|pages|log/i.test(extension) && doc_svg_1.default) ||
            (/ppt|pptx|pps/i.test(extension) && ppt_svg_1.default) ||
            (/xls|xlsx|csv/i.test(extension) && sheet_svg_1.default) ||
            (/zip|rar|7z|gz/i.test(extension) && zip_svg_1.default) ||
            file_svg_1.default);
    return (0, jsx_runtime_1.jsx)(Icon, { width: 32 });
});
