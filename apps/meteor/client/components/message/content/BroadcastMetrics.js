"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ChatContext_1 = require("../../../views/room/contexts/ChatContext");
const BroadcastMetrics = ({ username, message }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const chat = (0, ChatContext_1.useChat)();
    const handleReplyButtonClick = () => {
        chat === null || chat === void 0 ? void 0 : chat.flows.replyBroadcast(message);
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageBlock, { children: (0, jsx_runtime_1.jsx)(fuselage_1.MessageMetrics, { children: (0, jsx_runtime_1.jsx)(fuselage_1.MessageMetricsReply, { "data-username": username, "data-mid": message._id, onClick: handleReplyButtonClick, children: t('Reply') }) }) }));
};
exports.default = BroadcastMetrics;
