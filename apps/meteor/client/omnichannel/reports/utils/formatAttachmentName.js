"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAttachmentName = void 0;
const formatAttachmentName = (attachmentName, start, end) => `${attachmentName.toLocaleLowerCase().replace(/ /g, '_')}_${start}_${end}`;
exports.formatAttachmentName = formatAttachmentName;
