"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const InfoPanel_1 = require("../../components/InfoPanel");
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const MaxChatsPerAgentDisplay = ({ maxNumberSimultaneousChat = 0 }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    if (!hasLicense) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Max_number_of_chats_per_agent') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: maxNumberSimultaneousChat })] }));
};
exports.default = MaxChatsPerAgentDisplay;
