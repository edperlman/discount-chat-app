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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const EngagementDashboardPage_1 = __importDefault(require("./EngagementDashboardPage"));
const getURL_1 = require("../../../../app/utils/client/getURL");
const GenericUpsellModal_1 = __importDefault(require("../../../components/GenericUpsellModal"));
const hooks_1 = require("../../../components/GenericUpsellModal/hooks");
const PageSkeleton_1 = __importDefault(require("../../../components/PageSkeleton"));
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const isValidTab = (tab) => typeof tab === 'string' && ['users', 'messages', 'channels'].includes(tab);
const EngagementDashboardRoute = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const canViewEngagementDashboard = (0, ui_contexts_1.usePermission)('view-engagement-dashboard');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const isModalOpen = !!(0, ui_contexts_1.useCurrentModal)();
    const router = (0, ui_contexts_1.useRouter)();
    const tab = (0, ui_contexts_1.useRouteParameter)('tab');
    const eventStats = (0, ui_contexts_1.useEndpoint)('POST', '/v1/statistics.telemetry');
    const hasEngagementDashboard = (0, useHasLicenseModule_1.useHasLicenseModule)('engagement-dashboard');
    const { shouldShowUpsell, handleManageSubscription } = (0, hooks_1.useUpsellActions)(hasEngagementDashboard);
    (0, react_1.useEffect)(() => {
        if (shouldShowUpsell) {
            setModal((0, jsx_runtime_1.jsx)(GenericUpsellModal_1.default, { "aria-label": t('Engagement_Dashboard'), title: t('Engagement_Dashboard'), img: (0, getURL_1.getURL)('images/engagement.png'), subtitle: t('Analyze_practical_usage'), description: t('Enrich_your_workspace'), onClose: () => setModal(null), onConfirm: handleManageSubscription, onCancel: () => setModal(null) }));
        }
        router.subscribeToRouteChange(() => {
            if (!isValidTab(tab)) {
                router.navigate({
                    pattern: '/admin/engagement/:tab?',
                    params: { tab: 'users' },
                }, { replace: true });
            }
        });
    }, [shouldShowUpsell, router, tab, setModal, t, handleManageSubscription]);
    if (isModalOpen) {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    if (!canViewEngagementDashboard || !hasEngagementDashboard) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    eventStats({
        params: [{ eventName: 'updateCounter', settingsId: 'Engagement_Dashboard_Load_Count' }],
    });
    return ((0, jsx_runtime_1.jsx)(EngagementDashboardPage_1.default, { tab: tab, onSelectTab: (tab) => router.navigate({
            pattern: '/admin/engagement/:tab?',
            params: { tab },
        }) }));
};
exports.default = EngagementDashboardRoute;
