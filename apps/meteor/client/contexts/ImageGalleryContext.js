"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageGalleryContext = void 0;
const react_1 = require("react");
exports.ImageGalleryContext = (0, react_1.createContext)({
    imageId: '',
    isOpen: false,
    onClose: () => undefined,
});
