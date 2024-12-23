"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useTimeAgo_1 = require("../../../hooks/useTimeAgo");
const useGoToRoom_1 = require("../../../views/room/hooks/useGoToRoom");
const DiscussionMetrics = ({ lm, count, rid, drid }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const format = (0, useTimeAgo_1.useTimeAgo)();
    const goToRoom = (0, useGoToRoom_1.useGoToRoom)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageBlock, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.MessageMetrics, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsReply, { "data-rid": rid, "data-drid": drid, onClick: () => goToRoom(drid), children: count ? t('message_counter', { count }) : t('Reply') }), (0, jsx_runtime_1.jsxs)(fuselage_1.MessageMetricsItem, { title: lm === null || lm === void 0 ? void 0 : lm.toLocaleString(), children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemIcon, { name: 'clock' }), (0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemLabel, { children: lm ? format(lm) : t('No_messages_yet') })] })] }) }));
};
exports.default = DiscussionMetrics;
