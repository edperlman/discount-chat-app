"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiKitParserAttachment = void 0;
const SurfaceRenderer_1 = require("../../rendering/SurfaceRenderer");
class UiKitParserAttachment extends SurfaceRenderer_1.SurfaceRenderer {
    constructor() {
        super(['actions', 'context', 'divider', 'image', 'section', 'callout']);
    }
}
exports.UiKitParserAttachment = UiKitParserAttachment;
