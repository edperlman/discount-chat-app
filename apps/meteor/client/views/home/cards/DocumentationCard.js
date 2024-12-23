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
const DOCS_URL = 'https://go.rocket.chat/i/hp-documentation';
const DocumentationCard = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleOpenLink = (0, useExternalLink_1.useExternalLink)();
    return ((0, jsx_runtime_1.jsx)(GenericCard_1.GenericCard, Object.assign({ title: t('Documentation'), body: t('Learn_how_to_unlock_the_myriad_possibilities_of_rocket_chat'), buttons: [(0, jsx_runtime_1.jsx)(GenericCard_1.GenericCardButton, { onClick: () => handleOpenLink(DOCS_URL), children: t('See_documentation'), role: 'link' }, 1)], "data-qa-id": 'homepage-documentation-card', width: 'x340' }, props)));
};
exports.default = DocumentationCard;
