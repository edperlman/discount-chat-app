"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const gazzodown_1 = require("@rocket.chat/gazzodown");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GazzodownText_1 = __importDefault(require("../../../GazzodownText"));
const ThreadMessagePreviewBody = ({ message }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isEncryptedMessage = (0, core_typings_1.isE2EEMessage)(message);
    const getMessage = () => {
        const mdTokens = message.md && [...message.md];
        if (message.attachments &&
            Array.isArray(message.attachments) &&
            message.attachments.length > 0 &&
            (0, core_typings_1.isQuoteAttachment)(message.attachments[0])) {
            mdTokens === null || mdTokens === void 0 ? void 0 : mdTokens.shift();
        }
        if (message.attachments && message.msg === '') {
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: t('Message_with_attachment') });
        }
        if (!isEncryptedMessage || message.e2e === 'done') {
            return mdTokens ? ((0, jsx_runtime_1.jsx)(GazzodownText_1.default, { children: (0, jsx_runtime_1.jsx)(gazzodown_1.PreviewMarkup, { tokens: mdTokens }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: message.msg }));
        }
        if (isEncryptedMessage && message.e2e === 'pending') {
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: t('E2E_message_encrypted_placeholder') });
        }
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: message.msg });
    };
    return getMessage();
};
exports.default = (0, react_1.memo)(ThreadMessagePreviewBody);
