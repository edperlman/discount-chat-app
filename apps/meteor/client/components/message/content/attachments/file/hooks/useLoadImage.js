"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoadImage = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useLoadImage = () => {
    const [loadImage, setLoadImage] = (0, react_1.useState)((0, ui_contexts_1.useAttachmentAutoLoadEmbedMedia)());
    return [loadImage, (0, react_1.useCallback)(() => setLoadImage(true), [])];
};
exports.useLoadImage = useLoadImage;
