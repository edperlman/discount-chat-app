"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const links_1 = require("../../utils/links");
const InfoTextIconModal_1 = __importDefault(require("../InfoTextIconModal"));
const getFeatureSet = (modules, isEnterprise) => {
    const featureSet = [
        {
            success: isEnterprise,
            title: 'Premium_and_unlimited_apps',
        },
        {
            success: isEnterprise,
            title: 'Premium_omnichannel_capabilities',
        },
        {
            success: isEnterprise,
            title: 'Unlimited_push_notifications',
        },
        {
            success: modules.includes('videoconference-enterprise'),
            title: 'Video_call_manager',
        },
        {
            success: modules.includes('hide-watermark'),
            title: 'Remove_RocketChat_Watermark',
            infoText: 'Remove_RocketChat_Watermark_InfoText',
        },
        {
            success: modules.includes('scalability'),
            title: 'High_scalabaility',
        },
        {
            success: modules.includes('custom-roles'),
            title: 'Custom_roles',
        },
        {
            success: modules.includes('auditing'),
            title: 'Message_audit',
        },
    ];
    // eslint-disable-next-line no-nested-ternary
    return featureSet.sort(({ success: a }, { success: b }) => (a === b ? 0 : a ? -1 : 1));
};
const FeaturesCard = ({ activeModules, isEnterprise }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isSmall = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1180px)');
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.CardTitle, { children: !isEnterprise ? t('Unlock_premium_capabilities') : t('Includes') }), (0, jsx_runtime_1.jsx)(fuselage_1.CardBody, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', flexDirection: isSmall ? 'row' : 'column', children: getFeatureSet(activeModules, isEnterprise).map(({ success, title, infoText }, index) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', mbe: 4, width: isSmall ? '50%' : 'full', children: [(0, jsx_runtime_1.jsx)(fuselage_1.FramedIcon, { success: success, icon: success ? 'check' : 'lock' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'p2', mis: 12, mie: 2, color: 'font-secondary-info', children: t(title) }), infoText && (0, jsx_runtime_1.jsx)(InfoTextIconModal_1.default, { title: t(title), infoText: t(infoText) })] }, `feature_${index}`))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.CardControls, { children: (0, jsx_runtime_1.jsx)("a", { target: '_blank', rel: 'noopener noreferrer', href: links_1.PRICING_LINK, children: t('Compare_plans') }) })] }));
};
exports.default = FeaturesCard;
