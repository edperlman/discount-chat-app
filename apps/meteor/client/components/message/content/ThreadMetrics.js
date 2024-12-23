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
const ThreadMetricsFollow_1 = __importDefault(require("./ThreadMetricsFollow"));
const ThreadMetricsParticipants_1 = __importDefault(require("./ThreadMetricsParticipants"));
const useTimeAgo_1 = require("../../../hooks/useTimeAgo");
const useGoToThread_1 = require("../../../views/room/hooks/useGoToThread");
const ThreadMetrics = ({ unread, mention, all, rid, mid, counter, participants, following, lm }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const format = (0, useTimeAgo_1.useTimeAgo)();
    const goToThread = (0, useGoToThread_1.useGoToThread)();
    const { ref, borderBoxSize } = (0, fuselage_hooks_1.useResizeObserver)();
    const isSmall = (borderBoxSize.inlineSize || Infinity) < 320;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageBlock, { ref: ref, children: (0, jsx_runtime_1.jsxs)(fuselage_1.MessageMetrics, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsReply, { "data-rid": rid, "data-mid": mid, onClick: () => goToThread({ rid, tmid: mid }), primary: !!unread, position: 'relative', overflow: 'visible', children: t('View_thread') }), (0, jsx_runtime_1.jsx)(ThreadMetricsFollow_1.default, { unread: unread, mention: mention, all: all, mid: mid, rid: rid, following: following }), (participants === null || participants === void 0 ? void 0 : participants.length) > 0 && (0, jsx_runtime_1.jsx)(ThreadMetricsParticipants_1.default, { participants: participants }), (0, jsx_runtime_1.jsxs)(fuselage_1.MessageMetricsItem, { title: t('Last_message__date__', { date: format(lm) }), children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemIcon, { name: 'thread' }), isSmall ? ((0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemLabel, { children: t('__count__replies', { count: counter }) })) : ((0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemLabel, { children: t('__count__replies__date__', { count: counter, date: format(lm) }) }))] })] }) }));
};
exports.default = ThreadMetrics;
