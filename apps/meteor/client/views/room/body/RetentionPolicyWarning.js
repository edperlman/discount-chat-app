"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const withErrorBoundary_1 = require("../../../components/withErrorBoundary");
const usePruneWarningMessage_1 = require("../../../hooks/usePruneWarningMessage");
const RetentionPolicyWarning = ({ room }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const message = (0, usePruneWarningMessage_1.usePruneWarningMessage)(room);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', pi: 20, mb: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Bubble, { role: 'alert', "aria-live": 'polite', "aria-label": t('Retention_policy_warning_banner'), small: true, secondary: true, children: message }) }));
};
exports.default = (0, withErrorBoundary_1.withErrorBoundary)(RetentionPolicyWarning);
