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
const OmnichannelVerificationTag = ({ verified, onClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('contact-id-verification');
    const isVerified = hasLicense && verified;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: isVerified ? 'primary' : undefined, onClick: !isVerified && onClick ? onClick : undefined, icon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x12', mie: 4, name: isVerified ? 'success-circle' : 'question-mark' }), children: isVerified ? t('Verified') : t('Unverified') }));
};
exports.default = OmnichannelVerificationTag;
