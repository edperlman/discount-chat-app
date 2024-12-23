"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const usePruneWarningMessage_1 = require("../../hooks/usePruneWarningMessage");
const withErrorBoundary_1 = require("../withErrorBoundary");
const RetentionPolicyCallout = ({ room }) => {
    const message = (0, usePruneWarningMessage_1.usePruneWarningMessage)(room);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { "arial-label": t('Retention_policy_warning_callout'), role: 'alert', "aria-live": 'polite', type: 'warning', children: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("p", { children: message }) }) }));
};
exports.default = (0, withErrorBoundary_1.withErrorBoundary)(RetentionPolicyCallout);
