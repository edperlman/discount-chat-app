"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMarketPlaceMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const useUserDropdownAppsActionButtons_1 = require("../../../hooks/useUserDropdownAppsActionButtons");
const useAppRequestStats_1 = require("../../../views/marketplace/hooks/useAppRequestStats");
const useMarketPlaceMenu = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const appBoxItems = (0, useUserDropdownAppsActionButtons_1.useUserDropdownAppsActionButtons)();
    const hasManageAppsPermission = (0, ui_contexts_1.usePermission)('manage-apps');
    const hasAccessMarketplacePermission = (0, ui_contexts_1.usePermission)('access-marketplace');
    const showMarketplace = hasAccessMarketplacePermission || hasManageAppsPermission;
    const router = (0, ui_contexts_1.useRouter)();
    const appRequestStats = (0, useAppRequestStats_1.useAppRequestStats)();
    const marketPlaceItems = [
        {
            id: 'explore',
            icon: 'compass',
            content: t('Explore'),
            onClick: () => router.navigate('/marketplace/explore/list'),
        },
        {
            id: 'installed',
            icon: 'circle-arrow-down',
            content: t('Installed'),
            onClick: () => router.navigate('/marketplace/installed/list'),
        },
    ];
    const appsManagementItem = {
        id: 'requested-apps',
        icon: 'cube',
        content: t('Requested'),
        onClick: () => {
            router.navigate('/marketplace/requested/list');
        },
        addon: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [appRequestStats.isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'circle', height: 16, width: 16 }), appRequestStats.isSuccess && appRequestStats.data.totalUnseen > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Badge, { variant: 'primary', children: appRequestStats.data.totalUnseen }))] })),
    };
    return [
        {
            title: t('Marketplace'),
            items: [
                ...(showMarketplace ? marketPlaceItems : []),
                ...(hasManageAppsPermission ? [appsManagementItem] : []),
                ...(appBoxItems.isSuccess ? appBoxItems.data : []),
            ],
        },
    ];
};
exports.useMarketPlaceMenu = useMarketPlaceMenu;
