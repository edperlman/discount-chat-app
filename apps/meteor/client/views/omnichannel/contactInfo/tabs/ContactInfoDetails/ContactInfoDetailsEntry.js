"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ContactInfoCallButton_1 = __importDefault(require("./ContactInfoCallButton"));
const CallContext_1 = require("../../../../../contexts/CallContext");
const useClipboardWithToast_1 = __importDefault(require("../../../../../hooks/useClipboardWithToast"));
const ContactInfoDetailsEntry = ({ icon, isPhone, value }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { copy } = (0, useClipboardWithToast_1.default)(value);
    const isCallReady = (0, CallContext_1.useIsCallReady)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x18', name: icon }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withTruncatedText: true, display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'p2', withTruncatedText: true, "data-type": isPhone ? 'phone' : 'email', mi: 4, children: value }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [isCallReady && isPhone && (0, jsx_runtime_1.jsx)(ContactInfoCallButton_1.default, { phoneNumber: value }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { onClick: () => copy(), tiny: true, title: t('Copy'), icon: 'copy' })] })] })] }));
};
exports.default = ContactInfoDetailsEntry;
