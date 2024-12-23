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
exports.ImageGallery = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_aria_1 = require("react-aria");
const react_dom_1 = require("react-dom");
const react_i18next_1 = require("react-i18next");
const index_mjs_1 = require("swiper/modules/index.mjs");
const swiper_react_mjs_1 = require("swiper/swiper-react.mjs");
require("swiper/swiper.css");
require("swiper/modules/zoom.css");
const usePreventPropagation_1 = require("../../hooks/usePreventPropagation");
const swiperStyle = (0, css_in_js_1.css) `
	.swiper {
		width: 100%;
		height: 100%;
	}
	.swiper-container {
		position: absolute;
		z-index: 99;
		top: 0;

		overflow: hidden;

		width: 100%;
		height: 100%;

		background-color: var(--rcx-color-surface-overlay, rgba(0, 0, 0, 0.6));
	}

	.rcx-swiper-close-button,
	.rcx-swiper-prev-button,
	.rcx-swiper-next-button {
		color: var(--rcx-color-font-pure-white, #ffffff) !important;
	}

	.rcx-swiper-prev-button,
	.rcx-swiper-next-button {
		position: absolute;
		z-index: 10;
		top: 50%;

		cursor: pointer;
	}

	.rcx-swiper-prev-button.swiper-button-disabled,
	.rcx-swiper-next-button.swiper-button-disabled {
		cursor: auto;
		pointer-events: none;

		opacity: 0.35;
	}

	.rcx-swiper-prev-button.swiper-button-hidden,
	.rcx-swiper-next-button.swiper-button-hidden {
		cursor: auto;
		pointer-events: none;

		opacity: 0;
	}

	.rcx-swiper-prev-button,
	.swiper-rtl .rcx-swiper-next-button {
		right: auto;
		left: 10px;
	}

	.rcx-swiper-next-button,
	.swiper-rtl .rcx-swiper-prev-button {
		right: 10px;
		left: auto;
	}

	.rcx-lazy-preloader {
		position: absolute;
		z-index: -1;
		left: 50%;
		top: 50%;

		transform: translate(-50%, -50%);

		color: ${fuselage_1.Palette.text['font-pure-white']};
	}

	.rcx-swiper-controls {
		position: absolute;
		top: 0;
		right: 0;
		padding: 10px;
		z-index: 2;

		width: 100%;
		display: flex;
		justify-content: flex-end;
		transition: background-color 0.2s;
		&:hover {
			background-color: ${fuselage_1.Palette.surface['surface-overlay']};
			transition: background-color 0.2s;
		}
	}
`;
const ImageGallery = ({ images, onClose, loadMore }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const swiperRef = (0, react_1.useRef)(null);
    const [, setSwiperInst] = (0, react_1.useState)();
    const [zoomScale, setZoomScale] = (0, react_1.useState)(1);
    const [gridSize, setGridSize] = (0, react_1.useState)(images.length);
    const handleZoom = (ratio) => {
        var _a, _b;
        if ((_a = swiperRef.current) === null || _a === void 0 ? void 0 : _a.swiper.zoom) {
            const { scale, in: zoomIn } = (_b = swiperRef.current) === null || _b === void 0 ? void 0 : _b.swiper.zoom;
            setZoomScale(scale + ratio);
            return zoomIn(scale + ratio);
        }
    };
    const handleZoomIn = () => handleZoom(1);
    const handleZoomOut = () => handleZoom(-1);
    const handleResize = () => handleZoom(-(zoomScale - 1));
    const preventPropagation = (0, usePreventPropagation_1.usePreventPropagation)();
    return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(react_aria_1.FocusScope, { contain: true, autoFocus: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { role: 'dialog', "aria-modal": 'true', "aria-label": t('Image_gallery'), className: swiperStyle, children: (0, jsx_runtime_1.jsxs)("div", { role: 'presentation', className: 'swiper-container', onClick: onClose, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { role: 'toolbar', className: 'rcx-swiper-controls', onClick: preventPropagation, children: [zoomScale !== 1 && ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { name: 'resize', small: true, icon: 'arrow-collapse', title: t('Resize'), "rcx-swiper-zoom-out": true, onClick: handleResize })), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { name: 'zoom-out', small: true, icon: 'h-bar', title: t('Zoom_out'), "rcx-swiper-zoom-out": true, onClick: handleZoomOut, disabled: zoomScale === 1 }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { name: 'zoom-in', small: true, icon: 'plus', title: t('Zoom_in'), "rcx-swiper-zoom-in": true, onClick: handleZoomIn }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { name: 'close', small: true, icon: 'cross', "aria-label": t('Close_gallery'), className: 'rcx-swiper-close-button', onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'chevron-right', "aria-label": t('Next_image'), className: 'rcx-swiper-prev-button', onClick: preventPropagation }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'chevron-left', "aria-label": t('Previous_image'), className: 'rcx-swiper-next-button', onClick: preventPropagation }), (0, jsx_runtime_1.jsx)(swiper_react_mjs_1.Swiper, { ref: swiperRef, navigation: {
                            nextEl: '.rcx-swiper-next-button',
                            prevEl: '.rcx-swiper-prev-button',
                        }, keyboard: true, zoom: { toggle: false }, lazyPreloaderClass: 'rcx-lazy-preloader', runCallbacksOnInit: true, onKeyPress: (_, keyCode) => String(keyCode) === '27' && onClose(), modules: [index_mjs_1.Navigation, index_mjs_1.Zoom, index_mjs_1.Keyboard, index_mjs_1.A11y], onInit: (swiper) => setSwiperInst(swiper), onSlidesGridLengthChange: (swiper) => {
                            swiper.slideTo(images.length - gridSize, 0);
                            setGridSize(images.length);
                        }, onReachBeginning: loadMore, initialSlide: images.length - 1, children: [...images].reverse().map(({ _id, path, url }) => ((0, jsx_runtime_1.jsx)(swiper_react_mjs_1.SwiperSlide, { children: (0, jsx_runtime_1.jsxs)("div", { className: 'swiper-zoom-container', children: [(0, jsx_runtime_1.jsx)("img", { src: path || url, loading: 'lazy', alt: '', "data-qa-zoom-scale": zoomScale, onClick: preventPropagation }), (0, jsx_runtime_1.jsx)("div", { className: 'rcx-lazy-preloader', children: (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { inheritColor: true }) })] }) }, _id))) })] }) }) }), document.body);
};
exports.ImageGallery = ImageGallery;
