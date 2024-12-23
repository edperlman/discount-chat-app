"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiKitParserBanner = void 0;
const SurfaceRenderer_1 = require("../../rendering/SurfaceRenderer");
class UiKitParserBanner extends SurfaceRenderer_1.SurfaceRenderer {
    constructor() {
        super(['actions', 'context', 'divider', 'image', 'input', 'section']);
    }
}
exports.UiKitParserBanner = UiKitParserBanner;
