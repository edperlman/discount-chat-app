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
const WINDOWS_APP_URL = 'https://go.rocket.chat/i/hp-desktop-app-windows';
const LINUX_APP_URL = 'https://go.rocket.chat/i/hp-desktop-app-linux';
const MAC_APP_URL = 'https://go.rocket.chat/i/hp-desktop-app-mac';
const DesktopAppsCard = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleOpenLink = (0, useExternalLink_1.useExternalLink)();
    return ((0, jsx_runtime_1.jsx)(GenericCard_1.GenericCard, Object.assign({ title: t('Desktop_apps'), body: t('Install_rocket_chat_on_your_preferred_desktop_platform'), buttons: [
            (0, jsx_runtime_1.jsx)(GenericCard_1.GenericCardButton, { onClick: () => handleOpenLink(WINDOWS_APP_URL), children: t('Platform_Windows'), role: 'link' }, 1),
            (0, jsx_runtime_1.jsx)(GenericCard_1.GenericCardButton, { onClick: () => handleOpenLink(LINUX_APP_URL), children: t('Platform_Linux'), role: 'link' }, 2),
            (0, jsx_runtime_1.jsx)(GenericCard_1.GenericCardButton, { onClick: () => handleOpenLink(MAC_APP_URL), children: t('Platform_Mac'), role: 'link' }, 3),
        ], width: 'x340', "data-qa-id": 'homepage-desktop-apps-card' }, props)));
};
exports.default = DesktopAppsCard;
