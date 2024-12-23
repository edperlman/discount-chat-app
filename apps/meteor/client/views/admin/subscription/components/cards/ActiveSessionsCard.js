"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useActiveConnections_1 = require("../../../../hooks/useActiveConnections");
const FeatureUsageCard_1 = __importDefault(require("../FeatureUsageCard"));
const UpgradeButton_1 = __importDefault(require("../UpgradeButton"));
const getLimits = ({ max, current }) => {
    const total = max || 0;
    const used = current || 0;
    const available = total - used;
    const exceedLimit = used >= total;
    return {
        total,
        used,
        available,
        exceedLimit,
    };
};
const ActiveSessionsCard = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const result = (0, useActiveConnections_1.useActiveConnections)();
    const card = {
        title: t('ActiveSessions'),
        infoText: t('ActiveSessions_InfoText'),
    };
    if (result.isLoading || result.isError) {
        return ((0, jsx_runtime_1.jsx)(FeatureUsageCard_1.default, { card: card, children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: 'x112', height: 'x112' }) }));
    }
    const { total, used, available, exceedLimit } = getLimits(result.data);
    return ((0, jsx_runtime_1.jsx)(FeatureUsageCard_1.default, { card: Object.assign(Object.assign({}, card), (exceedLimit && {
            upgradeButton: ((0, jsx_runtime_1.jsx)(UpgradeButton_1.default, { target: 'active-session-card', action: 'upgrade', small: true, children: t('Upgrade') })),
        })), children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'font-secondary-info', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'h1', color: exceedLimit ? 'font-danger' : 'font-default', mbe: 12, children: [used, " / ", total] }), available, " ", t('ActiveSessions_available')] }) }));
};
exports.default = ActiveSessionsCard;
