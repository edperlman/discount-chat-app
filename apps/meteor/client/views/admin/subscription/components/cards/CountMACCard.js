"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const FeatureUsageCard_1 = __importDefault(require("../FeatureUsageCard"));
const CountMACCard = ({ macsCount }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(FeatureUsageCard_1.default, { card: {
            title: t('Monthly_active_contacts'),
            infoText: t('CountMAC_InfoText'),
        }, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'h1', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { color: 'font-annotation', name: 'headset', size: 40, mie: 4 }), macsCount] }) }));
};
exports.default = CountMACCard;
