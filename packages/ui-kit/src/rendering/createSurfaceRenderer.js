"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSurfaceRenderer = void 0;
const createSurfaceRenderer = () => (surfaceRenderer, conditions) => (blocks) => surfaceRenderer.render(blocks, conditions);
exports.createSurfaceRenderer = createSurfaceRenderer;
