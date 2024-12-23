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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const ScreenshotCarousel_1 = __importDefault(require("./ScreenshotCarousel"));
const ScreenshotCarouselAnchor = ({ screenshots }) => {
    var _a;
    const [viewCarousel, setViewCarousel] = (0, react_1.useState)(false);
    const [currentSlideIndex, setCurrentSlideIndex] = (0, react_1.useState)(0);
    const [currentPreviewIndex, setCurrentPreviewIndex] = (0, react_1.useState)(0);
    const { length } = screenshots;
    const isFirstSlide = currentSlideIndex === 0;
    const isLastSlide = currentSlideIndex === length - 1;
    const isCarouselVisible = viewCarousel && (screenshots === null || screenshots === void 0 ? void 0 : screenshots.length);
    const handleNextSlide = () => {
        setCurrentSlideIndex(currentSlideIndex + 1);
    };
    const handlePrevSlide = () => {
        setCurrentSlideIndex(currentSlideIndex - 1);
    };
    const handleKeyboardKey = (0, react_1.useCallback)((onKeyDownEvent) => {
        const keysObject = {
            ArrowLeft: () => setCurrentSlideIndex((prevSlideIndex) => (prevSlideIndex !== 0 ? prevSlideIndex - 1 : 0)),
            ArrowRight: () => setCurrentSlideIndex((prevSlideIndex) => (prevSlideIndex !== length - 1 ? prevSlideIndex + 1 : length - 1)),
            Escape: () => setViewCarousel(false),
        };
        keysObject[onKeyDownEvent.key]();
    }, [length]);
    (0, react_1.useEffect)(() => {
        const intervalId = setInterval(() => {
            setCurrentPreviewIndex((prevIndex) => {
                if (prevIndex === length - 1)
                    return 0;
                return prevIndex + 1;
            });
        }, 5000);
        document.addEventListener('keydown', handleKeyboardKey);
        return () => {
            clearInterval(intervalId);
            document.removeEventListener('keydown', handleKeyboardKey);
        };
    }, [handleKeyboardKey, length]);
    const carouselPortal = (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(ScreenshotCarousel_1.default, { AppScreenshots: screenshots, setViewCarousel: setViewCarousel, handleNextSlide: handleNextSlide, handlePrevSlide: handlePrevSlide, isFirstSlide: isFirstSlide, isLastSlide: isLastSlide, currentSlideIndex: currentSlideIndex }), document.body);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { onClick: () => setViewCarousel(true), display: 'flex', flexDirection: 'column', maxWidth: 'x640', width: '100%', style: {
                    cursor: 'pointer',
                }, tabIndex: 0, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', src: (_a = screenshots[currentPreviewIndex]) === null || _a === void 0 ? void 0 : _a.accessUrl, alt: 'App preview image', className: [
                            (0, css_in_js_1.css) `
							transition: filter 0.2s ease;
							&:hover {
								filter: brightness(90%);
							}
						`,
                        ] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', bg: 'tint', pi: 16, pb: 10, alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'image', size: 'x24', mie: 8 }), ' ', (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', fontScale: 'p2m', color: 'default', children: [currentPreviewIndex + 1, " of ", screenshots.length] })] })] }), isCarouselVisible && carouselPortal] }));
};
exports.default = ScreenshotCarouselAnchor;
