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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const ImageGallery_1 = require("../components/ImageGallery");
const ImageGalleryContext_1 = require("../contexts/ImageGalleryContext");
const ImageGalleryData_1 = __importDefault(require("../views/room/ImageGallery/ImageGalleryData"));
const ImageGalleryProvider = ({ children }) => {
    const [imageId, setImageId] = (0, react_1.useState)();
    const [singleImageUrl, setSingleImageUrl] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        const handleImageClick = (event) => {
            var _a, _b;
            const target = event === null || event === void 0 ? void 0 : event.target;
            if (target === null || target === void 0 ? void 0 : target.closest('.rcx-attachment__details')) {
                return setSingleImageUrl(target.dataset.id);
            }
            if (target === null || target === void 0 ? void 0 : target.classList.contains('preview-image')) {
                return setSingleImageUrl(target.dataset.id);
            }
            if (target === null || target === void 0 ? void 0 : target.classList.contains('gallery-item')) {
                const id = ((_a = target.closest('.gallery-item-container')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-id')) || undefined;
                return setImageId(target.dataset.id || id);
            }
            if (target === null || target === void 0 ? void 0 : target.classList.contains('gallery-item-container')) {
                return setImageId(target.dataset.id);
            }
            if ((target === null || target === void 0 ? void 0 : target.classList.contains('rcx-avatar__element')) && target.closest('.gallery-item')) {
                const avatarTarget = ((_b = target.closest('.gallery-item-container')) === null || _b === void 0 ? void 0 : _b.getAttribute('data-id')) || undefined;
                return setImageId(avatarTarget);
            }
        };
        document.addEventListener('click', handleImageClick);
        return () => document.removeEventListener('click', handleImageClick);
    }, []);
    return ((0, jsx_runtime_1.jsxs)(ImageGalleryContext_1.ImageGalleryContext.Provider, { value: { imageId: imageId || '', isOpen: !!imageId, onClose: () => setImageId(undefined) }, children: [children, !!singleImageUrl && ((0, jsx_runtime_1.jsx)(ImageGallery_1.ImageGallery, { images: [{ _id: singleImageUrl, url: singleImageUrl }], onClose: () => setSingleImageUrl(undefined) })), !!imageId && (0, jsx_runtime_1.jsx)(ImageGalleryData_1.default, {})] }));
};
exports.default = ImageGalleryProvider;
