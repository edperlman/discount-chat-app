"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericCard_1 = require("../../../components/GenericCard");
const useExternalLink_1 = require("../../../hooks/useExternalLink");
const GOOGLE_PLAY_URL = 'https://go.rocket.chat/i/hp-mobile-app-google';
const APP_STORE_URL = 'https://go.rocket.chat/i/hp-mobile-app-apple';
const MobileAppsCard = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleOpenLink = (0, useExternalLink_1.useExternalLink)();
    return ((0, jsx_runtime_1.jsx)(GenericCard_1.GenericCard, Object.assign({ title: t('Mobile_apps'), body: t('Take_rocket_chat_with_you_with_mobile_applications'), buttons: [
            (0, jsx_runtime_1.jsx)(GenericCard_1.GenericCardButton, { onClick: () => handleOpenLink(GOOGLE_PLAY_URL), children: t('Google_Play'), role: 'link' }, 1),
            (0, jsx_runtime_1.jsx)(GenericCard_1.GenericCardButton, { onClick: () => handleOpenLink(APP_STORE_URL), children: t('App_Store'), role: 'link' }, 2),
        ], "data-qa-id": 'homepage-mobile-apps-card', width: 'x340' }, props)));
};
exports.default = MobileAppsCard;
