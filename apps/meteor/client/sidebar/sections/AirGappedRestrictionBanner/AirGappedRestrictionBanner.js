"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AirGappedRestrictionWarning_1 = __importDefault(require("./AirGappedRestrictionWarning"));
const AirGappedRestrictionSection = ({ isRestricted, remainingDays }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.SidebarBanner, { text: (0, jsx_runtime_1.jsx)(AirGappedRestrictionWarning_1.default, { isRestricted: isRestricted, remainingDays: remainingDays }), description: (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: 'https://go.rocket.chat/i/airgapped-restriction', children: t('Learn_more') }) }));
};
exports.default = AirGappedRestrictionSection;
