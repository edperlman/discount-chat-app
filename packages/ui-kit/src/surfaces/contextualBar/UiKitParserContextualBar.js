"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiKitParserContextualBar = void 0;
const SurfaceRenderer_1 = require("../../rendering/SurfaceRenderer");
class UiKitParserContextualBar extends SurfaceRenderer_1.SurfaceRenderer {
    constructor() {
        super(['actions', 'context', 'divider', 'image', 'input', 'section']);
    }
}
exports.UiKitParserContextualBar = UiKitParserContextualBar;
