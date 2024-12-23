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
const UpgradeButton_1 = __importDefault(require("../UpgradeButton"));
const UsagePieGraph_1 = __importDefault(require("../UsagePieGraph"));
const SeatsCard = ({ value, max, hideManageSubscription }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const pieGraph = {
        used: value,
        total: max,
    };
    const nearLimit = pieGraph && pieGraph.used / pieGraph.total >= 0.8;
    const card = Object.assign({ title: t('Seats'), infoText: t('Seats_InfoText') }, (!hideManageSubscription &&
        nearLimit && {
        upgradeButton: ((0, jsx_runtime_1.jsx)(UpgradeButton_1.default, { target: 'seats-card', action: 'buy_more', small: true, children: t('Buy_more') })),
    }));
    const seatsLeft = pieGraph.total - pieGraph.used;
    const color = pieGraph.used / pieGraph.total >= 0.8 ? fuselage_1.Palette.statusColor['status-font-on-danger'].toString() : undefined;
    const message = seatsLeft > 0 ? t('Seats_Available', { seatsLeft }) : undefined;
    return ((0, jsx_runtime_1.jsx)(FeatureUsageCard_1.default, { card: card, children: (0, jsx_runtime_1.jsx)(UsagePieGraph_1.default, { label: message, used: pieGraph.used, total: pieGraph.total, color: color }) }));
};
exports.default = SeatsCard;
