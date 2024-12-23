"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpsellActions = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useExternalLink_1 = require("../../../hooks/useExternalLink");
const useIsEnterprise_1 = require("../../../hooks/useIsEnterprise");
const useCheckoutUrl_1 = require("../../../views/admin/subscription/hooks/useCheckoutUrl");
const TALK_TO_SALES_URL = 'https://go.rocket.chat/i/contact-sales';
const useUpsellActions = (hasLicenseModule = false) => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const handleOpenLink = (0, useExternalLink_1.useExternalLink)();
    const cloudWorkspaceHadTrial = (0, ui_contexts_1.useSetting)('Cloud_Workspace_Had_Trial', false);
    const { data } = (0, useIsEnterprise_1.useIsEnterprise)();
    const shouldShowUpsell = !(data === null || data === void 0 ? void 0 : data.isEnterprise) || !hasLicenseModule;
    const openExternalLink = (0, useExternalLink_1.useExternalLink)();
    const manageSubscriptionUrl = (0, useCheckoutUrl_1.useCheckoutUrl)()({ target: 'upsell-modal', action: 'upgrade' });
    const handleManageSubscription = (0, react_1.useCallback)(() => {
        openExternalLink(manageSubscriptionUrl);
        setModal(null);
    }, [manageSubscriptionUrl, openExternalLink, setModal]);
    const handleTalkToSales = (0, react_1.useCallback)(() => {
        handleOpenLink(TALK_TO_SALES_URL);
        setModal(null);
    }, [handleOpenLink, setModal]);
    return { shouldShowUpsell, cloudWorkspaceHadTrial, handleManageSubscription, handleTalkToSales };
};
exports.useUpsellActions = useUpsellActions;
