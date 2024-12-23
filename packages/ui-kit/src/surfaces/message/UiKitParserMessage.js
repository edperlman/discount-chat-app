"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiKitParserMessage = void 0;
const SurfaceRenderer_1 = require("../../rendering/SurfaceRenderer");
class UiKitParserMessage extends SurfaceRenderer_1.SurfaceRenderer {
    constructor() {
        super(['actions', 'context', 'divider', 'image', 'section', 'preview', 'video_conf', 'callout']);
    }
}
exports.UiKitParserMessage = UiKitParserMessage;
