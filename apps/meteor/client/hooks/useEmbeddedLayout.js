"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEmbeddedLayout = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useEmbeddedLayout = () => (0, ui_contexts_1.useLayout)().isEmbedded;
exports.useEmbeddedLayout = useEmbeddedLayout;
