"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ScreenshotCarousel = ({ AppScreenshots, setViewCarousel, handleNextSlide, handlePrevSlide, isFirstSlide, isLastSlide, currentSlideIndex, }) => {
    const handleScreenshotRender = () => AppScreenshots.map((currentScreenshot, index) => {
        const isCurrentImageOnScreen = index === currentSlideIndex;
        const screenshotWrapperStyle = isCurrentImageOnScreen
            ? {
                opacity: '1',
                transitionDuration: '1s',
                transform: 'scale(1.08)',
            }
            : {
                opacity: '0',
                transitionDuration: '1s ease',
            };
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: screenshotWrapperStyle, children: isCurrentImageOnScreen && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', src: currentScreenshot.accessUrl, alt: 'Carousel image', maxWidth: 'x1200', maxHeight: 'x600', w: '100%', height: '100%' })) }, currentScreenshot.id));
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'fixed', w: '100%', h: '100vh', bg: 'font-pure-black', opacity: '0.7', marginBlock: '-0.75px', zIndex: '2' }), !isFirstSlide && ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { secondary: true, icon: 'chevron-right', onClick: handlePrevSlide, style: { top: '50%', left: '10px', cursor: 'pointer', transform: 'translateY(-50%)' }, position: 'absolute', zIndex: 3 })), !isLastSlide && ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { secondary: true, icon: 'chevron-left', onClick: handleNextSlide, style: { top: '50%', right: '10px', cursor: 'pointer', transform: 'translateY(-50%)' }, position: 'absolute', zIndex: 3 })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { onClick: () => setViewCarousel(false), position: 'fixed', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '2', mi: 38, children: handleScreenshotRender() })] }));
};
exports.default = ScreenshotCarousel;
