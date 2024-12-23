"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPreviewBlockWithPreview = exports.isPreviewBlockWithThumb = void 0;
const isPreviewBlockWithThumb = (previewBlock) => 'thumb' in previewBlock;
exports.isPreviewBlockWithThumb = isPreviewBlockWithThumb;
const isPreviewBlockWithPreview = (previewBlock) => 'externalUrl' in previewBlock || 'oembedUrl' in previewBlock;
exports.isPreviewBlockWithPreview = isPreviewBlockWithPreview;
