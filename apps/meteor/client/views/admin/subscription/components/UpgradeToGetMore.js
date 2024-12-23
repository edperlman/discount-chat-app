"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericCard_1 = require("../../../../components/GenericCard");
const useExternalLink_1 = require("../../../../hooks/useExternalLink");
const links_1 = require("../utils/links");
const enterpriseModules = [
    'scalability',
    'accessibility-certification',
    'engagement-dashboard',
    'oauth-enterprise',
    'custom-roles',
    'auditing',
];
const UpgradeToGetMore = ({ activeModules, children }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleOpenLink = (0, useExternalLink_1.useExternalLink)();
    const upgradeModules = enterpriseModules
        .filter((module) => !activeModules.includes(module))
        .map((module) => {
        return {
            title: t(`UpgradeToGetMore_${module}_Title`),
            body: t(`UpgradeToGetMore_${module}_Body`),
        };
    });
    if ((upgradeModules === null || upgradeModules === void 0 ? void 0 : upgradeModules.length) === 0) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { large: true, vertical: true, children: children }));
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { w: 'full', p: 8, mbs: 40, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'rocket' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('UpgradeToGetMore_Headline') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('UpgradeToGetMore_Subtitle') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.CardGrid, { breakpoints: {
                    xs: 4,
                    sm: 4,
                    md: 4,
                    lg: 6,
                    xl: 4,
                    p: 8,
                }, children: upgradeModules.map((card, index) => {
                    return (0, jsx_runtime_1.jsx)(GenericCard_1.GenericCard, Object.assign({ icon: 'check', type: 'success', height: 'full' }, card), index);
                }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { pbs: 24, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { large: true, vertical: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'new-window', onClick: () => handleOpenLink(links_1.PRICING_LINK), role: 'link', children: t('Compare_plans') }), children] }) })] }));
};
exports.default = (0, react_1.memo)(UpgradeToGetMore);
