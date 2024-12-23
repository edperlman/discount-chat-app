"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ThreadMetricsParticipants = ({ participants }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const hideAvatar = !(0, ui_contexts_1.useUserPreference)('displayAvatars');
    const participantsLengthExcludingVisibleAvatars = participants.length - 2;
    const participantsLabel = participantsLengthExcludingVisibleAvatars > 0 ? `+${participantsLengthExcludingVisibleAvatars}` : undefined;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageMetricsItem, { title: t('Follower', { count: participants.length }), children: [hideAvatar && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemIcon, { name: 'user' }), (0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemLabel, { children: participants.length })] })), !hideAvatar && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemAvatarRow, { children: participants.slice(0, 2).map((uid) => ((0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemAvatarRowContent, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x16', userId: uid }) }, uid))) }), participantsLabel && (0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsItemLabel, { children: participantsLabel })] }))] }));
};
exports.default = ThreadMetricsParticipants;
