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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const ImageBox_1 = __importDefault(require("./image/ImageBox"));
const Load_1 = __importDefault(require("./image/Load"));
const Retry_1 = __importDefault(require("./image/Retry"));
const getDimensions = (originalWidth, originalHeight, limits) => {
    const widthRatio = originalWidth / limits.width;
    const heightRatio = originalHeight / limits.height;
    if (widthRatio > heightRatio) {
        const width = Math.min(originalWidth, limits.width);
        const height = (width / originalWidth) * originalHeight;
        return { width, height, ratio: (height / width) * 100 };
    }
    const height = Math.min(originalHeight, limits.height);
    const width = (height / originalHeight) * originalWidth;
    return { width, height, ratio: (height / width) * 100 };
};
const AttachmentImage = (_a) => {
    var { id, previewUrl, dataSrc, loadImage = true, setLoadImage, src } = _a, size = __rest(_a, ["id", "previewUrl", "dataSrc", "loadImage", "setLoadImage", "src"]);
    const limits = (0, ui_contexts_1.useAttachmentDimensions)();
    const [error, setError] = (0, react_1.useState)(false);
    const { width = limits.width, height = limits.height } = size;
    const { setHasNoError } = (0, react_1.useMemo)(() => ({
        setHasNoError: () => setError(false),
    }), []);
    const dimensions = getDimensions(width, height, limits);
    const background = previewUrl && `url(${previewUrl}) center center / cover no-repeat fixed`;
    if (!loadImage) {
        return (0, jsx_runtime_1.jsx)(Load_1.default, { width: dimensions.width || limits.width, height: dimensions.height || limits.height, load: setLoadImage });
    }
    if (error) {
        return (0, jsx_runtime_1.jsx)(Retry_1.default, { retry: setHasNoError });
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { width: dimensions.width, maxWidth: 'full', position: 'relative', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { pbs: `${dimensions.ratio}%`, position: 'relative', children: (0, jsx_runtime_1.jsx)(ImageBox_1.default, { is: 'picture', position: 'absolute', onError: () => setError(true), style: Object.assign(Object.assign({}, (previewUrl && { background, boxSizing: 'content-box' })), { top: 0, left: 0, bottom: 0, right: 0 }), children: (0, jsx_runtime_1.jsx)("img", { "data-id": id, className: 'gallery-item', "data-src": dataSrc || src, src: src, alt: '', width: dimensions.width, height: dimensions.height, loading: 'lazy' }) }) }) }));
};
exports.default = (0, react_1.memo)(AttachmentImage);
