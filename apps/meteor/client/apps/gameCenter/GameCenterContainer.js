"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../components/Contextualbar");
const GameCenterContainer = ({ handleClose, handleBack, game }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [handleBack && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarBack, { onClick: handleBack }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarTitle, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { url: game.icon }), " ", game.name] }), handleClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { pb: 16, children: (0, jsx_runtime_1.jsx)("iframe", { title: t('Apps_Game_Center'), style: { position: 'absolute', width: '95%', height: '80%' }, src: game.url }) })] }));
};
exports.default = GameCenterContainer;
