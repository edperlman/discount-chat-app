"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionTag = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const VersionTag = ({ versionStatus, title }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (versionStatus === 'outdated') {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Tag, { title: title, variant: 'danger', children: t('Outdated') }));
    }
    if (versionStatus === 'latest') {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Tag, { title: title, variant: 'primary', children: t('Latest') }));
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Tag, { title: title, variant: 'secondary', children: t('New_version_available') }));
};
exports.VersionTag = VersionTag;
