"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericUpsellModal_1 = __importDefault(require("../../components/GenericUpsellModal"));
const hooks_1 = require("../../components/GenericUpsellModal/hooks");
const UnlimitedAppsUpsellModal = ({ onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { handleManageSubscription, cloudWorkspaceHadTrial } = (0, hooks_1.useUpsellActions)();
    return ((0, jsx_runtime_1.jsx)(GenericUpsellModal_1.default, { title: t('Enable_unlimited_apps'), img: 'images/unlimited-apps-modal.png', subtitle: t('Get_all_apps'), description: !cloudWorkspaceHadTrial ? t('Workspaces_on_community_edition_trial_on') : t('Workspaces_on_community_edition_trial_off'), onConfirm: handleManageSubscription, onCancel: onClose, onClose: onClose }));
};
exports.default = UnlimitedAppsUpsellModal;
