"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const EngagementDashboardCard_1 = __importDefault(require("../EngagementDashboardCard"));
const MessagesPerChannelSection_1 = __importDefault(require("./MessagesPerChannelSection"));
const MessagesSentSection_1 = __importDefault(require("./MessagesSentSection"));
const MessagesTab = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(EngagementDashboardCard_1.default, { title: t('Messages_sent'), children: (0, jsx_runtime_1.jsx)(MessagesSentSection_1.default, {}) }), (0, jsx_runtime_1.jsx)(EngagementDashboardCard_1.default, { title: t('Where_are_the_messages_being_sent?'), children: (0, jsx_runtime_1.jsx)(MessagesPerChannelSection_1.default, {}) })] }));
};
exports.default = MessagesTab;
