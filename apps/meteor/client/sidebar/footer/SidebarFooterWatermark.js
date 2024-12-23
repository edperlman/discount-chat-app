"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarFooterWatermark = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useLicense_1 = require("../../hooks/useLicense");
const SidebarFooterWatermark = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const response = (0, useLicense_1.useLicense)();
    const licenseName = (0, useLicense_1.useLicenseName)();
    if (response.isLoading || response.isError) {
        return null;
    }
    if (licenseName.isError || licenseName.isLoading) {
        return null;
    }
    const license = response.data;
    if (license.activeModules.includes('hide-watermark') && !license.trial) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 16, pbe: 8, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'a', href: 'https://rocket.chat/', target: '_blank', rel: 'noopener noreferrer', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'micro', color: 'hint', pbe: 4, children: t('Powered_by_RocketChat') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'micro', color: 'pure-white', pbe: 4, children: licenseName.data })] }) }));
};
exports.SidebarFooterWatermark = SidebarFooterWatermark;
