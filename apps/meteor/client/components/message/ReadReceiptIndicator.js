"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ReadReceiptIndicator = ({ mid, unread }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { role: 'status', id: `${mid}-read-status`, "aria-label": unread ? t('Message_sent') : t('Message_viewed'), position: 'absolute', insetBlockStart: 2, insetInlineEnd: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x16', name: unread ? 'check-single' : 'check-double', color: unread ? 'annotation' : 'info' }) }));
};
exports.default = ReadReceiptIndicator;
