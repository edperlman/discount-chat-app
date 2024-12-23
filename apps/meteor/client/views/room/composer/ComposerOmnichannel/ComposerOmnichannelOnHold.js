"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposerOmnichannelOnHold = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useResumeChatOnHoldMutation_1 = require("./hooks/useResumeChatOnHoldMutation");
const RoomContext_1 = require("../../contexts/RoomContext");
const ComposerOmnichannelOnHold = () => {
    const resumeChatOnHoldMutation = (0, useResumeChatOnHoldMutation_1.useResumeChatOnHoldMutation)();
    const room = (0, RoomContext_1.useOmnichannelRoom)();
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(ui_composer_1.MessageFooterCallout, { children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutContent, { children: t('chat_on_hold_due_to_inactivity') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutAction, { disabled: resumeChatOnHoldMutation.isLoading, onClick: () => resumeChatOnHoldMutation.mutate(room._id), children: t('Resume') })] }));
};
exports.ComposerOmnichannelOnHold = ComposerOmnichannelOnHold;
