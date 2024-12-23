"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const useOembedLayout_1 = require("../hooks/useOembedLayout");
const OEmbedResolver_1 = __importDefault(require("./urlPreviews/OEmbedResolver"));
const UrlPreview_1 = __importDefault(require("./urlPreviews/UrlPreview"));
const buildImageURL_1 = require("./urlPreviews/buildImageURL");
const normalizeMeta = ({ url, meta }) => {
    const image = meta.ogImage || meta.twitterImage || meta.msapplicationTileImage || meta.oembedThumbnailUrl || meta.oembedThumbnailUrl;
    const imageHeight = meta.ogImageHeight || meta.oembedHeight || meta.oembedThumbnailHeight;
    const imageWidth = meta.ogImageWidth || meta.oembedWidth || meta.oembedThumbnailWidth;
    return Object.fromEntries(Object.entries(Object.assign(Object.assign(Object.assign({ siteName: meta.ogSiteName || meta.oembedProviderName, siteUrl: meta.ogUrl || meta.oembedProviderUrl, title: meta.ogTitle || meta.twitterTitle || meta.title || meta.pageTitle || meta.oembedTitle, description: meta.ogDescription || meta.twitterDescription || meta.description, authorName: meta.oembedAuthorName, authorUrl: meta.oembedAuthorUrl }, (image && {
        image: {
            url: (0, buildImageURL_1.buildImageURL)(url, image),
            dimensions: Object.assign(Object.assign({}, (imageHeight && { height: imageHeight })), (imageWidth && { width: imageWidth })),
        },
    })), { url: meta.oembedUrl || url, type: meta.ogType || meta.oembedType }), (meta.oembedHtml && { html: meta.oembedHtml }))).filter(([, value]) => value));
};
const hasContentType = (headers) => headers ? 'contentType' in headers : false;
const getHeaderType = (headers) => {
    if (!hasContentType(headers)) {
        return;
    }
    if (headers.contentType.match(/image\/.*/)) {
        return 'image';
    }
    if (headers.contentType.match(/audio\/.*/)) {
        return 'audio';
    }
    if (headers.contentType.match(/video\/.*/)) {
        return 'video';
    }
};
const isValidPreviewMeta = ({ siteName, siteUrl, authorName, authorUrl, title, description, image, html, }) => !((!siteName || !siteUrl) && (!authorName || !authorUrl) && !title && !description && !image && !html);
const hasMeta = (url) => !!url.meta && !!Object.values(url.meta);
const processMetaAndHeaders = (url) => {
    var _a;
    if (!url.headers && !url.meta) {
        return false;
    }
    const data = hasMeta(url) ? normalizeMeta(url) : undefined;
    if (data && isValidPreviewMeta(data)) {
        return { type: 'oembed', data };
    }
    const type = getHeaderType(url.headers);
    if (!type) {
        return false;
    }
    return {
        type: 'headers',
        data: { url: url.url, type, originalType: hasContentType(url.headers) ? (_a = url.headers) === null || _a === void 0 ? void 0 : _a.contentType : '' },
    };
};
const isPreviewData = (data) => !!data;
const isMetaPreview = (_data, type) => type === 'oembed';
const UrlPreviews = ({ urls }) => {
    const { maxWidth: oembedMaxWidth } = (0, useOembedLayout_1.useOembedLayout)();
    const metaAndHeaders = urls.map(processMetaAndHeaders).filter(isPreviewData);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: metaAndHeaders.map(({ type, data }, index) => {
            if (isMetaPreview(data, type)) {
                return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageBlock, { width: '100%', maxWidth: oembedMaxWidth, children: (0, jsx_runtime_1.jsx)(OEmbedResolver_1.default, { meta: data }) }, index));
            }
            return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageBlock, { width: '100%', maxWidth: oembedMaxWidth, children: (0, jsx_runtime_1.jsx)(UrlPreview_1.default, Object.assign({}, data)) }, index));
        }) }));
};
exports.default = UrlPreviews;
