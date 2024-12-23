"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageGalleryError = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_dom_1 = require("react-dom");
const react_i18next_1 = require("react-i18next");
const GenericError_1 = __importDefault(require("../GenericError/GenericError"));
const closeButtonStyle = (0, css_in_js_1.css) `
	position: absolute;
	z-index: 10;
	top: 10px;
	right: 10px;
`;
const ImageGalleryError = ({ onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)(fuselage_1.ModalBackdrop, { display: 'flex', justifyContent: 'center', color: 'pure-white', children: [(0, jsx_runtime_1.jsx)(GenericError_1.default, { buttonAction: onClose, buttonTitle: t('Close') }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'cross', "aria-label": t('Close_gallery'), className: closeButtonStyle, onClick: onClose })] }), document.body);
};
exports.ImageGalleryError = ImageGalleryError;
