"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelSubscriptionModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const links_1 = require("../utils/links");
const CancelSubscriptionModal = ({ planName, onCancel, onConfirm }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', title: t('Cancel__planName__subscription', { planName }), icon: null, confirmText: t('Cancel_subscription'), cancelText: t('Dont_cancel'), onConfirm: onConfirm, onCancel: onCancel, children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Cancel_subscription_message', t: t, children: [(0, jsx_runtime_1.jsx)("strong", { children: "This workspace will downgrade to Community and lose free access to premium capabilities." }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("br", {}), "While you can keep using Rocket.Chat, your team will lose access to unlimited mobile push notifications, read receipts, marketplace apps and ", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: links_1.DOWNGRADE_LINK, children: "other capabilities" }), "."] }) }));
};
exports.CancelSubscriptionModal = CancelSubscriptionModal;
