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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const FilePreview_1 = require("./FilePreview");
const ImagePreview_1 = __importDefault(require("./ImagePreview"));
const PreviewSkeleton_1 = __importDefault(require("./PreviewSkeleton"));
const userAgentMIMETypeFallback_1 = require("../../../../lib/utils/userAgentMIMETypeFallback");
const readFileAsDataURL = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => { var _a; return callback(((_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.result) || null); };
    return reader.readAsDataURL(file);
};
const useFileAsDataURL = (file) => {
    const [loaded, setLoaded] = (0, react_1.useState)(false);
    const [url, setUrl] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        setLoaded(false);
        readFileAsDataURL(file, (url) => {
            setUrl(url);
            setLoaded(true);
        });
    }, [file]);
    return [loaded, url];
};
const MediaPreview = ({ file, fileType }) => {
    const [loaded, url] = useFileAsDataURL(file);
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!loaded) {
        return (0, jsx_runtime_1.jsx)(PreviewSkeleton_1.default, {});
    }
    if (typeof url !== 'string') {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', w: 'full', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'image', size: 'x24', mie: 4 }), t('FileUpload_Cannot_preview_file')] }));
    }
    if (fileType === FilePreview_1.FilePreviewType.IMAGE) {
        return (0, jsx_runtime_1.jsx)(ImagePreview_1.default, { url: url, file: file });
    }
    if (fileType === FilePreview_1.FilePreviewType.VIDEO) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'video', w: 'full', controls: true, children: [(0, jsx_runtime_1.jsx)("source", { src: url, type: (0, userAgentMIMETypeFallback_1.userAgentMIMETypeFallback)(file.type) }), t('Browser_does_not_support_video_element')] }));
    }
    if (fileType === FilePreview_1.FilePreviewType.AUDIO) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.AudioPlayer, { src: url });
    }
    throw new Error('Wrong props provided for MediaPreview');
};
exports.default = (0, react_1.memo)(MediaPreview);
