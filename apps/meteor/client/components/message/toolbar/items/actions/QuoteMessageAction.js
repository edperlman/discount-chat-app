"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useAutoTranslate_1 = require("../../../../../views/room/MessageList/hooks/useAutoTranslate");
const ChatContext_1 = require("../../../../../views/room/contexts/ChatContext");
const MessageToolbarItem_1 = __importDefault(require("../../MessageToolbarItem"));
const QuoteMessageAction = ({ message, subscription }) => {
    const chat = (0, ChatContext_1.useChat)();
    const autoTranslateOptions = (0, useAutoTranslate_1.useAutoTranslate)(subscription);
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!chat || !subscription) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(MessageToolbarItem_1.default, { id: 'quote-message', icon: 'quote', title: t('Quote'), qa: 'Quote', onClick: () => {
            var _a;
            if (message && (autoTranslateOptions === null || autoTranslateOptions === void 0 ? void 0 : autoTranslateOptions.autoTranslateEnabled) && autoTranslateOptions.showAutoTranslate(message)) {
                message.msg =
                    message.translations && autoTranslateOptions.autoTranslateLanguage
                        ? message.translations[autoTranslateOptions.autoTranslateLanguage]
                        : message.msg;
            }
            (_a = chat === null || chat === void 0 ? void 0 : chat.composer) === null || _a === void 0 ? void 0 : _a.quoteMessage(message);
        } }));
};
exports.default = QuoteMessageAction;
