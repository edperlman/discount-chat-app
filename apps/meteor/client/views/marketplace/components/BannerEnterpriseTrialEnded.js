"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const BannerEnterpriseTrialEnded = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isAdmin = (0, ui_contexts_1.usePermission)('manage-apps');
    const bannerLink = {
        link: '/links/manage-subscription',
        linkText: t('Upgrade_tab_upgrade_your_plan'),
        linkTarget: '_blank',
    };
    const cloudWorkspaceHadTrial = (0, ui_contexts_1.useSetting)('Cloud_Workspace_Had_Trial', false);
    const [showTrialBanner, setShowTrialBanner] = (0, fuselage_hooks_1.useLocalStorage)('showAppsTrialEndBanner', cloudWorkspaceHadTrial);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: showTrialBanner && ((0, jsx_runtime_1.jsx)(fuselage_1.Banner, Object.assign({ closeable: true, icon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'store', size: 'x24' }), variant: 'warning', title: t('Apps_disabled_when_Premium_trial_ended'), onClose: () => setShowTrialBanner(false) }, (isAdmin && bannerLink), { children: isAdmin
                ? t('Apps_disabled_when_Premium_trial_ended_description_admin')
                : t('Apps_disabled_when_Premium_trial_ended_description') }))) }));
};
exports.default = BannerEnterpriseTrialEnded;
