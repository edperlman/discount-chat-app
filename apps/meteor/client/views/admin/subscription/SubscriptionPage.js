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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const i18next_1 = require("i18next");
const react_1 = __importStar(require("react"));
const tinykeys_1 = __importDefault(require("tinykeys"));
const SubscriptionCalloutLimits_1 = require("./SubscriptionCalloutLimits");
const SubscriptionPageSkeleton_1 = __importDefault(require("./SubscriptionPageSkeleton"));
const UpgradeButton_1 = __importDefault(require("./components/UpgradeButton"));
const UpgradeToGetMore_1 = __importDefault(require("./components/UpgradeToGetMore"));
const ActiveSessionsCard_1 = __importDefault(require("./components/cards/ActiveSessionsCard"));
const ActiveSessionsPeakCard_1 = __importDefault(require("./components/cards/ActiveSessionsPeakCard"));
const AppsUsageCard_1 = __importDefault(require("./components/cards/AppsUsageCard"));
const CountMACCard_1 = __importDefault(require("./components/cards/CountMACCard"));
const CountSeatsCard_1 = __importDefault(require("./components/cards/CountSeatsCard"));
const FeaturesCard_1 = __importDefault(require("./components/cards/FeaturesCard"));
const MACCard_1 = __importDefault(require("./components/cards/MACCard"));
const PlanCard_1 = __importDefault(require("./components/cards/PlanCard"));
const PlanCardCommunity_1 = __importDefault(require("./components/cards/PlanCard/PlanCardCommunity"));
const SeatsCard_1 = __importDefault(require("./components/cards/SeatsCard"));
const useCancelSubscriptionModal_1 = require("./hooks/useCancelSubscriptionModal");
const useWorkspaceSync_1 = require("./hooks/useWorkspaceSync");
const Page_1 = require("../../../components/Page");
const useIsEnterprise_1 = require("../../../hooks/useIsEnterprise");
const useLicense_1 = require("../../../hooks/useLicense");
const useRegistrationStatus_1 = require("../../../hooks/useRegistrationStatus");
function useShowLicense() {
    const [showLicenseTab, setShowLicenseTab] = (0, fuselage_hooks_1.useSessionStorage)('admin:showLicenseTab', false);
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, tinykeys_1.default)(window, {
            'ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a': () => {
                setShowLicenseTab((showLicenseTab) => !showLicenseTab);
            },
        });
        return () => {
            unsubscribe();
        };
    });
    return showLicenseTab;
}
const SubscriptionPage = () => {
    var _a;
    const showLicense = useShowLicense();
    const router = (0, ui_contexts_1.useRouter)();
    const { data: enterpriseData } = (0, useIsEnterprise_1.useIsEnterprise)();
    const { isRegistered } = (0, useRegistrationStatus_1.useRegistrationStatus)();
    const { data: licensesData, isLoading: isLicenseLoading } = (0, useLicense_1.useLicense)({ loadValues: true });
    const syncLicenseUpdate = (0, useWorkspaceSync_1.useWorkspaceSync)();
    const invalidateLicenseQuery = (0, useLicense_1.useInvalidateLicense)();
    const subscriptionSuccess = (0, ui_contexts_1.useSearchParameter)('subscriptionSuccess');
    const showSubscriptionCallout = (0, fuselage_hooks_1.useDebouncedValue)(subscriptionSuccess || syncLicenseUpdate.isLoading, 10000);
    const { license, limits, activeModules = [] } = licensesData || {};
    const { isEnterprise = true } = enterpriseData || {};
    const getKeyLimit = (key) => {
        const { max, value } = (limits === null || limits === void 0 ? void 0 : limits[key]) || {};
        return {
            max: max !== undefined && max !== -1 ? max : Infinity,
            value,
        };
    };
    const macLimit = getKeyLimit('monthlyActiveContacts');
    const seatsLimit = getKeyLimit('activeUsers');
    const { isLoading: isCancelSubscriptionLoading, open: openCancelSubscriptionModal } = (0, useCancelSubscriptionModal_1.useCancelSubscriptionModal)();
    const handleSyncLicenseUpdate = (0, react_1.useCallback)(() => {
        syncLicenseUpdate.mutate(undefined, {
            onSuccess: () => invalidateLicenseQuery(100),
        });
    }, [invalidateLicenseQuery, syncLicenseUpdate]);
    (0, react_1.useEffect)(() => {
        if (subscriptionSuccess && syncLicenseUpdate.isIdle) {
            handleSyncLicenseUpdate();
            return;
        }
        if (subscriptionSuccess) {
            router.navigate({
                name: router.getRouteName(),
                params: Object.fromEntries(Object.entries(router.getSearchParameters()).filter(([key]) => key !== 'subscriptionSuccess')),
            }, {
                replace: true,
            });
        }
    }, [handleSyncLicenseUpdate, router, subscriptionSuccess, syncLicenseUpdate.isIdle]);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { bg: 'tint', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: (0, i18next_1.t)('Subscription'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [isRegistered && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: syncLicenseUpdate.isLoading, icon: 'reload', onClick: () => handleSyncLicenseUpdate(), children: (0, i18next_1.t)('Sync_license_update') })), (0, jsx_runtime_1.jsx)(UpgradeButton_1.default, { target: 'subscription_header', action: isEnterprise ? 'manage_subscription' : 'upgrade', primary: true, children: (0, i18next_1.t)(isEnterprise ? 'Manage_subscription' : 'Upgrade') })] }) }), (0, jsx_runtime_1.jsxs)(Page_1.PageScrollableContentWithShadow, { p: 16, children: [(showSubscriptionCallout || syncLicenseUpdate.isLoading) && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'info', title: (0, i18next_1.t)('Sync_license_update_Callout_Title'), m: 8, children: (0, i18next_1.t)('Sync_license_update_Callout') })), (0, jsx_runtime_1.jsx)(SubscriptionCalloutLimits_1.SubscriptionCalloutLimits, {}), isLicenseLoading && (0, jsx_runtime_1.jsx)(SubscriptionPageSkeleton_1.default, {}), !isLicenseLoading && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showLicense && ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: (0, i18next_1.t)('License'), children: (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(licensesData, null, 2) }) }) })), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { marginBlock: 'none', marginInline: 'auto', width: 'full', color: 'default', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Grid, { m: 0, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Grid.Item, { lg: 4, xs: 4, p: 8, children: [license && (0, jsx_runtime_1.jsx)(PlanCard_1.default, { licenseInformation: license.information, licenseLimits: { activeUsers: seatsLimit } }), !license && (0, jsx_runtime_1.jsx)(PlanCardCommunity_1.default, {})] }), (0, jsx_runtime_1.jsx)(fuselage_1.Grid.Item, { lg: 8, xs: 4, p: 8, children: (0, jsx_runtime_1.jsx)(FeaturesCard_1.default, { activeModules: activeModules, isEnterprise: isEnterprise }) }), seatsLimit.value !== undefined && ((0, jsx_runtime_1.jsx)(fuselage_1.Grid.Item, { lg: 6, xs: 4, p: 8, children: seatsLimit.max !== Infinity ? ((0, jsx_runtime_1.jsx)(SeatsCard_1.default, { value: seatsLimit.value, max: seatsLimit.max, hideManageSubscription: licensesData === null || licensesData === void 0 ? void 0 : licensesData.trial })) : ((0, jsx_runtime_1.jsx)(CountSeatsCard_1.default, { activeUsers: seatsLimit === null || seatsLimit === void 0 ? void 0 : seatsLimit.value })) })), macLimit.value !== undefined && ((0, jsx_runtime_1.jsx)(fuselage_1.Grid.Item, { lg: 6, xs: 4, p: 8, children: macLimit.max !== Infinity ? ((0, jsx_runtime_1.jsx)(MACCard_1.default, { max: macLimit.max, value: macLimit.value, hideManageSubscription: licensesData === null || licensesData === void 0 ? void 0 : licensesData.trial })) : ((0, jsx_runtime_1.jsx)(CountMACCard_1.default, { macsCount: macLimit.value })) })), !license && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(limits === null || limits === void 0 ? void 0 : limits.marketplaceApps) !== undefined && ((0, jsx_runtime_1.jsx)(fuselage_1.Grid.Item, { lg: 4, xs: 4, p: 8, children: (0, jsx_runtime_1.jsx)(AppsUsageCard_1.default, { privateAppsLimit: limits === null || limits === void 0 ? void 0 : limits.privateApps, marketplaceAppsLimit: limits.marketplaceApps }) })), (0, jsx_runtime_1.jsx)(fuselage_1.Grid.Item, { lg: 4, xs: 4, p: 8, children: (0, jsx_runtime_1.jsx)(ActiveSessionsCard_1.default, {}) }), (0, jsx_runtime_1.jsx)(fuselage_1.Grid.Item, { lg: 4, xs: 4, p: 8, children: (0, jsx_runtime_1.jsx)(ActiveSessionsPeakCard_1.default, {}) })] }))] }), (0, jsx_runtime_1.jsx)(UpgradeToGetMore_1.default, { activeModules: activeModules, isEnterprise: isEnterprise, children: Boolean((_a = licensesData === null || licensesData === void 0 ? void 0 : licensesData.license) === null || _a === void 0 ? void 0 : _a.information.cancellable) && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: isCancelSubscriptionLoading, secondary: true, danger: true, onClick: openCancelSubscriptionModal, children: (0, i18next_1.t)('Cancel_subscription') })) })] })] }))] })] }));
};
exports.default = (0, react_1.memo)(SubscriptionPage);
