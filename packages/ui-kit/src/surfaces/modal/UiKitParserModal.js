"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiKitParserModal = void 0;
const SurfaceRenderer_1 = require("../../rendering/SurfaceRenderer");
class UiKitParserModal extends SurfaceRenderer_1.SurfaceRenderer {
    constructor() {
        super(['actions', 'context', 'divider', 'image', 'input', 'section', 'callout']);
    }
}
exports.UiKitParserModal = UiKitParserModal;
