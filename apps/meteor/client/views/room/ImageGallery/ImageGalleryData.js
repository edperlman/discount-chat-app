"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const ImageGallery_1 = require("../../../components/ImageGallery");
const ImageGalleryContext_1 = require("../../../contexts/ImageGalleryContext");
const useRecordList_1 = require("../../../hooks/lists/useRecordList");
const RoomContext_1 = require("../contexts/RoomContext");
const useImagesList_1 = require("./hooks/useImagesList");
const ImageGalleryData = () => {
    const { _id: rid } = (0, RoomContext_1.useRoom)();
    const { imageId, onClose } = (0, react_1.useContext)(ImageGalleryContext_1.ImageGalleryContext);
    const { filesList, loadMoreItems } = (0, useImagesList_1.useImagesList)((0, react_1.useMemo)(() => ({ roomId: rid, startingFromId: imageId }), [imageId, rid]));
    const { phase, items: images, error } = (0, useRecordList_1.useRecordList)(filesList);
    if (error) {
        return (0, jsx_runtime_1.jsx)(ImageGallery_1.ImageGalleryError, { onClose: onClose });
    }
    if (phase === 'loading') {
        return (0, jsx_runtime_1.jsx)(ImageGallery_1.ImageGalleryLoading, { onClose: onClose });
    }
    return (0, jsx_runtime_1.jsx)(ImageGallery_1.ImageGallery, { images: images, loadMore: () => loadMoreItems(images.length - 1), onClose: onClose });
};
exports.default = ImageGalleryData;