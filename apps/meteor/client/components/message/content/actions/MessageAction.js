"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const resolveLegacyIcon = (legacyIcon) => {
    if (legacyIcon === 'icon-videocam') {
        return 'video';
    }
    return legacyIcon === null || legacyIcon === void 0 ? void 0 : legacyIcon.replace(/^icon-/, '');
};
const MessageAction = ({ icon, methodId, i18nLabel, label, runAction, danger }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const resolvedIcon = resolveLegacyIcon(icon);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: resolvedIcon, "data-method-id": methodId, onClick: runAction(methodId), marginInline: 4, small: true, danger: danger, children: i18nLabel ? t(i18nLabel) : label }));
};
exports.default = MessageAction;
