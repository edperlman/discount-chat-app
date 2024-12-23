"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MapViewImage = ({ linkUrl, imageUrl }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: linkUrl, children: (0, jsx_runtime_1.jsx)("img", { src: imageUrl, alt: t('Shared_Location') }) }));
};
exports.default = MapViewImage;
