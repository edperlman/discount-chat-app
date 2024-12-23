"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const AppearanceFieldLabel = ({ children, premium = false }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const shouldDisableEnterprise = premium && !hasLicense;
    if (!shouldDisableEnterprise) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: children });
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', mie: 4, children: children }), (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'featured', children: t('Premium') })] }));
};
exports.default = AppearanceFieldLabel;
