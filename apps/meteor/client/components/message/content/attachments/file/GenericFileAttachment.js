"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const getFileExtension_1 = require("../../../../../../lib/utils/getFileExtension");
const useDownloadFromServiceWorker_1 = require("../../../../../hooks/useDownloadFromServiceWorker");
const MarkdownText_1 = __importDefault(require("../../../../MarkdownText"));
const MessageCollapsible_1 = __importDefault(require("../../../MessageCollapsible"));
const MessageContentBody_1 = __importDefault(require("../../../MessageContentBody"));
const AttachmentSize_1 = __importDefault(require("../structure/AttachmentSize"));
const openDocumentViewer = (_a = window.RocketChatDesktop) === null || _a === void 0 ? void 0 : _a.openDocumentViewer;
const GenericFileAttachment = ({ title, description, descriptionMd, title_link: link, title_link_download: hasDownload, size, format, collapsed, }) => {
    const getURL = (0, ui_contexts_1.useMediaUrl)();
    const uid = (0, fuselage_hooks_1.useUniqueId)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleTitleClick = (event) => {
        if (!link) {
            return;
        }
        if (openDocumentViewer && format === 'PDF') {
            event.preventDefault();
            const url = new URL(getURL(link), window.location.origin);
            url.searchParams.set('contentDisposition', 'inline');
            openDocumentViewer(url.toString(), format, '');
            return;
        }
        if (link.includes('/file-decrypt/')) {
            event.preventDefault();
            (0, useDownloadFromServiceWorker_1.registerDownloadForUid)(uid, t, title);
            (0, useDownloadFromServiceWorker_1.forAttachmentDownload)(uid, link);
        }
    };
    const getExternalUrl = () => {
        if (!hasDownload || !link)
            return undefined;
        if (openDocumentViewer) {
            const url = new URL(getURL(link), window.location.origin);
            url.searchParams.set('download', '');
            return url.toString();
        }
        return getURL(link);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [descriptionMd ? (0, jsx_runtime_1.jsx)(MessageContentBody_1.default, { md: descriptionMd }) : (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { parseEmoji: true, content: description }), (0, jsx_runtime_1.jsx)(MessageCollapsible_1.default, { title: title, hasDownload: hasDownload, link: link, isCollapsed: collapsed, children: (0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreview, { style: { maxWidth: 368, width: '100%' }, children: (0, jsx_runtime_1.jsxs)(fuselage_1.MessageGenericPreviewContent, { thumb: (0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreviewIcon, { name: 'attachment-file', type: format || (0, getFileExtension_1.getFileExtension)(title) }), children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreviewTitle, { download: !!openDocumentViewer, externalUrl: getExternalUrl(), onClick: handleTitleClick, "data-qa-type": 'attachment-title-link', children: title }), size && ((0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreviewDescription, { children: (0, jsx_runtime_1.jsx)(AttachmentSize_1.default, { size: size, wrapper: false }) }))] }) }) })] }));
};
exports.default = GenericFileAttachment;
