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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const AppStatus_1 = require("@rocket.chat/apps-engine/definition/AppStatus");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const semver_1 = __importDefault(require("semver"));
const useAppInstallationHandler_1 = require("./useAppInstallationHandler");
const useAppsCountQuery_1 = require("./useAppsCountQuery");
const useMarketplaceActions_1 = require("./useMarketplaceActions");
const useOpenAppPermissionsReviewModal_1 = require("./useOpenAppPermissionsReviewModal");
const useOpenIncompatibleModal_1 = require("./useOpenIncompatibleModal");
const WarningModal_1 = __importDefault(require("../../../components/WarningModal"));
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const useIsEnterprise_1 = require("../../../hooks/useIsEnterprise");
const AddonRequiredModal_1 = __importDefault(require("../AppsList/AddonRequiredModal"));
const IframeModal_1 = __importDefault(require("../IframeModal"));
const UninstallGrandfatheredAppModal_1 = __importDefault(require("../components/UninstallGrandfatheredAppModal/UninstallGrandfatheredAppModal"));
const helpers_1 = require("../helpers");
const handleAPIError_1 = require("../helpers/handleAPIError");
const warnEnableDisableApp_1 = require("../helpers/warnEnableDisableApp");
const useAppMenu = (app, isAppDetailsPage) => {
    var _a, _b, _c;
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const openIncompatibleModal = (0, useOpenIncompatibleModal_1.useOpenIncompatibleModal)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const currentTab = (0, ui_contexts_1.useRouteParameter)('tab');
    const appCountQuery = (0, useAppsCountQuery_1.useAppsCountQuery)(context);
    const isAdminUser = (0, ui_contexts_1.usePermission)('manage-apps');
    const { data } = (0, useIsEnterprise_1.useIsEnterprise)();
    const isEnterpriseLicense = !!(data === null || data === void 0 ? void 0 : data.isEnterprise);
    const workspaceHasMarketplaceAddon = (0, useHasLicenseModule_1.useHasLicenseModule)(app.addon);
    const workspaceHasInstalledAddon = (0, useHasLicenseModule_1.useHasLicenseModule)(app.installedAddon);
    const [isLoading, setLoading] = (0, react_1.useState)(false);
    const [requestedEndUser, setRequestedEndUser] = (0, react_1.useState)(app.requestedEndUser);
    const [isAppPurchased, setPurchased] = (0, react_1.useState)(app === null || app === void 0 ? void 0 : app.isPurchased);
    const button = (0, helpers_1.appButtonProps)(Object.assign(Object.assign({}, app), { isAdminUser, endUserRequested: false }));
    const buttonLabel = button === null || button === void 0 ? void 0 : button.label.replace(' ', '_');
    const action = (button === null || button === void 0 ? void 0 : button.action) || '';
    const setAppStatus = (0, ui_contexts_1.useEndpoint)('POST', '/apps/:id/status', { id: app.id });
    const buildExternalUrl = (0, ui_contexts_1.useEndpoint)('GET', '/apps');
    const syncApp = (0, ui_contexts_1.useEndpoint)('POST', '/apps/:id/sync', { id: app.id });
    const uninstallApp = (0, ui_contexts_1.useEndpoint)('DELETE', '/apps/:id', { id: app.id });
    const canAppBeSubscribed = app.purchaseType === 'subscription';
    const isSubscribed = app.subscriptionInfo && ['active', 'trialing'].includes(app.subscriptionInfo.status);
    const isAppEnabled = app.status ? helpers_1.appEnabledStatuses.includes(app.status) : false;
    const closeModal = (0, react_1.useCallback)(() => {
        setModal(null);
        setLoading(false);
    }, [setModal, setLoading]);
    const marketplaceActions = (0, useMarketplaceActions_1.useMarketplaceActions)();
    const installationSuccess = (0, react_1.useCallback)((action, permissionsGranted) => __awaiter(void 0, void 0, void 0, function* () {
        if (action) {
            if (action === 'request') {
                setRequestedEndUser(true);
            }
            else {
                yield marketplaceActions[action](Object.assign(Object.assign({}, app), { permissionsGranted }));
            }
        }
        setLoading(false);
    }), [app, marketplaceActions, setLoading]);
    const openPermissionModal = (0, useOpenAppPermissionsReviewModal_1.useOpenAppPermissionsReviewModal)({
        app,
        onCancel: closeModal,
        onConfirm: (permissionsGranted) => installationSuccess(action, permissionsGranted),
    });
    const appInstallationHandler = (0, useAppInstallationHandler_1.useAppInstallationHandler)({
        app,
        isAppPurchased,
        action,
        onDismiss: closeModal,
        onSuccess: installationSuccess,
        setIsPurchased: setPurchased,
    });
    // TODO: There is no necessity of all these callbacks being out of the above useMemo.
    // My propose here is to refactor the hook to make it clearer and with less unnecessary caching.
    const missingAddonHandler = (0, react_1.useCallback)((actionType) => {
        setModal((0, jsx_runtime_1.jsx)(AddonRequiredModal_1.default, { actionType: actionType, onDismiss: closeModal, onInstallAnyway: appInstallationHandler }));
    }, [appInstallationHandler, closeModal, setModal]);
    const handleAddon = (0, react_1.useCallback)((actionType, callback) => {
        if (actionType === 'enable' && isAdminUser && app.installedAddon && !workspaceHasInstalledAddon) {
            return missingAddonHandler(actionType);
        }
        if (actionType !== 'enable' && isAdminUser && app.addon && !workspaceHasMarketplaceAddon) {
            return missingAddonHandler(actionType);
        }
        callback();
    }, [app.addon, app.installedAddon, isAdminUser, missingAddonHandler, workspaceHasInstalledAddon, workspaceHasMarketplaceAddon]);
    const handleAcquireApp = (0, react_1.useCallback)(() => {
        setLoading(true);
        handleAddon('install', appInstallationHandler);
    }, [appInstallationHandler, handleAddon]);
    const handleSubscription = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if ((app === null || app === void 0 ? void 0 : app.versionIncompatible) && !isSubscribed) {
            openIncompatibleModal(app, 'subscribe', closeModal);
            return;
        }
        let data;
        try {
            data = (yield buildExternalUrl({
                buildExternalUrl: 'true',
                appId: app.id,
                purchaseType: app.purchaseType,
                details: 'true',
            }));
        }
        catch (error) {
            (0, handleAPIError_1.handleAPIError)(error);
            return;
        }
        const confirm = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield syncApp();
            }
            catch (error) {
                (0, handleAPIError_1.handleAPIError)(error);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(IframeModal_1.default, { url: data.url, confirm: confirm, cancel: closeModal }));
    }), [app, isSubscribed, setModal, closeModal, openIncompatibleModal, buildExternalUrl, syncApp]);
    const handleViewLogs = (0, react_1.useCallback)(() => {
        router.navigate({
            name: 'marketplace',
            params: {
                context,
                page: 'info',
                id: app.id,
                version: app.version,
                tab: 'logs',
            },
        });
    }, [app.id, app.version, context, router]);
    const handleDisable = (0, react_1.useCallback)(() => {
        const confirm = () => __awaiter(void 0, void 0, void 0, function* () {
            closeModal();
            try {
                const { status } = yield setAppStatus({ status: AppStatus_1.AppStatus.MANUALLY_DISABLED });
                (0, warnEnableDisableApp_1.warnEnableDisableApp)(app.name, status, 'disable');
            }
            catch (error) {
                (0, handleAPIError_1.handleAPIError)(error);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(WarningModal_1.default, { close: closeModal, confirm: confirm, text: t('Apps_Marketplace_Deactivate_App_Prompt'), confirmText: t('Yes') }));
    }, [app.name, closeModal, setAppStatus, setModal, t]);
    const handleEnable = (0, react_1.useCallback)(() => {
        handleAddon('enable', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { status } = yield setAppStatus({ status: AppStatus_1.AppStatus.MANUALLY_ENABLED });
                (0, warnEnableDisableApp_1.warnEnableDisableApp)(app.name, status, 'enable');
            }
            catch (error) {
                (0, handleAPIError_1.handleAPIError)(error);
            }
        }));
    }, [app.name, handleAddon, setAppStatus]);
    const handleUninstall = (0, react_1.useCallback)(() => {
        const uninstall = () => __awaiter(void 0, void 0, void 0, function* () {
            closeModal();
            try {
                const { success } = yield uninstallApp();
                if (success) {
                    dispatchToastMessage({ type: 'success', message: `${app.name} uninstalled` });
                    if (context === 'details' && currentTab !== 'details') {
                        router.navigate({
                            name: 'marketplace',
                            params: Object.assign(Object.assign({}, router.getRouteParameters()), { tab: 'details' }),
                        }, { replace: true });
                    }
                }
            }
            catch (error) {
                (0, handleAPIError_1.handleAPIError)(error);
            }
        });
        if (isSubscribed) {
            const confirm = () => __awaiter(void 0, void 0, void 0, function* () {
                yield handleSubscription();
            });
            setModal((0, jsx_runtime_1.jsx)(WarningModal_1.default, { close: closeModal, cancel: uninstall, confirm: confirm, text: t('Apps_Marketplace_Uninstall_Subscribed_App_Prompt'), confirmText: t('Apps_Marketplace_Modify_App_Subscription'), cancelText: t('Apps_Marketplace_Uninstall_Subscribed_App_Anyway') }));
        }
        if (!appCountQuery.data) {
            return;
        }
        if (app.migrated) {
            setModal((0, jsx_runtime_1.jsx)(UninstallGrandfatheredAppModal_1.default, { context: context, appName: app.name, limit: appCountQuery.data.limit, handleUninstall: uninstall, handleClose: closeModal }));
            return;
        }
        setModal((0, jsx_runtime_1.jsx)(WarningModal_1.default, { close: closeModal, confirm: uninstall, text: t('Apps_Marketplace_Uninstall_App_Prompt'), confirmText: t('Yes') }));
    }, [
        isSubscribed,
        appCountQuery.data,
        app.migrated,
        app.name,
        setModal,
        closeModal,
        t,
        uninstallApp,
        dispatchToastMessage,
        context,
        currentTab,
        router,
        handleSubscription,
    ]);
    const incompatibleIconName = (0, react_1.useCallback)((app, action) => {
        if (!app.versionIncompatible) {
            if (action === 'update') {
                return 'refresh';
            }
            return 'card';
        }
        // Now we are handling an incompatible app
        if (action === 'subscribe' && !isSubscribed) {
            return 'warning';
        }
        if (action === 'install' || action === 'update') {
            return 'warning';
        }
        return 'card';
    }, [isSubscribed]);
    const handleUpdate = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        if (app === null || app === void 0 ? void 0 : app.versionIncompatible) {
            openIncompatibleModal(app, 'update', closeModal);
            return;
        }
        handleAddon('update', openPermissionModal);
    }), [app, handleAddon, openPermissionModal, openIncompatibleModal, closeModal]);
    const canUpdate = app.installed && app.version && app.marketplaceVersion && semver_1.default.lt(app.version, app.marketplaceVersion);
    const menuSections = (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d;
        const bothAppStatusOptions = [
            canAppBeSubscribed &&
                isSubscribed &&
                isAdminUser && {
                id: 'subscribe',
                section: 0,
                content: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: incompatibleIconName(app, 'subscribe'), size: 'x16', mie: 4 }), t('Subscription')] })),
                onClick: handleSubscription,
            },
        ];
        const nonInstalledAppOptions = [
            !app.installed &&
                !!button && {
                id: 'acquire',
                section: 0,
                disabled: requestedEndUser,
                content: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isAdminUser && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: incompatibleIconName(app, 'install'), size: 'x16', mie: 4 }), t(buttonLabel)] })),
                onClick: handleAcquireApp,
            },
        ];
        const isEnterpriseOrNot = (app.isEnterpriseOnly && isEnterpriseLicense) || !app.isEnterpriseOnly;
        const isPossibleToEnableApp = app.installed && isAdminUser && !isAppEnabled && isEnterpriseOrNot;
        const doesItReachedTheLimit = !app.migrated &&
            !((_a = appCountQuery === null || appCountQuery === void 0 ? void 0 : appCountQuery.data) === null || _a === void 0 ? void 0 : _a.hasUnlimitedApps) &&
            ((_b = appCountQuery === null || appCountQuery === void 0 ? void 0 : appCountQuery.data) === null || _b === void 0 ? void 0 : _b.enabled) !== undefined &&
            ((_c = appCountQuery === null || appCountQuery === void 0 ? void 0 : appCountQuery.data) === null || _c === void 0 ? void 0 : _c.enabled) >= ((_d = appCountQuery === null || appCountQuery === void 0 ? void 0 : appCountQuery.data) === null || _d === void 0 ? void 0 : _d.limit);
        const installedAppOptions = [
            context !== 'details' &&
                isAdminUser &&
                app.installed && {
                id: 'viewLogs',
                section: 0,
                content: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'desktop-text', size: 'x16', mie: 4 }), t('View_Logs')] })),
                onClick: handleViewLogs,
            },
            isAdminUser &&
                !!canUpdate &&
                !isAppDetailsPage && {
                id: 'update',
                section: 0,
                content: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: incompatibleIconName(app, 'update'), size: 'x16', mie: 4 }), t('Update')] })),
                onClick: handleUpdate,
            },
            app.installed &&
                isAdminUser &&
                isAppEnabled && {
                id: 'disable',
                section: 0,
                content: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'status-font-on-warning', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'ban', size: 'x16', mie: 4 }), t('Disable')] })),
                onClick: handleDisable,
            },
            isPossibleToEnableApp && {
                id: 'enable',
                section: 0,
                disabled: doesItReachedTheLimit,
                content: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'check', size: 'x16', marginInlineEnd: 'x4' }), t('Enable')] })),
                onClick: handleEnable,
            },
            app.installed &&
                isAdminUser && {
                id: 'uninstall',
                section: 1,
                content: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'status-font-on-danger', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'trash', size: 'x16', mie: 4 }), t('Uninstall')] })),
                onClick: handleUninstall,
            },
        ];
        const filtered = [...bothAppStatusOptions, ...nonInstalledAppOptions, ...installedAppOptions].flatMap((value) => value && typeof value !== 'boolean' ? value : []);
        const sections = [];
        filtered.forEach((option) => {
            if (typeof sections[option.section] === 'undefined') {
                sections[option.section] = { items: [] };
            }
            sections[option.section].items.push(option);
        });
        return sections;
    }, [
        canAppBeSubscribed,
        isSubscribed,
        isAdminUser,
        incompatibleIconName,
        app,
        t,
        handleSubscription,
        button,
        requestedEndUser,
        buttonLabel,
        handleAcquireApp,
        isEnterpriseLicense,
        isAppEnabled,
        (_a = appCountQuery === null || appCountQuery === void 0 ? void 0 : appCountQuery.data) === null || _a === void 0 ? void 0 : _a.hasUnlimitedApps,
        (_b = appCountQuery === null || appCountQuery === void 0 ? void 0 : appCountQuery.data) === null || _b === void 0 ? void 0 : _b.enabled,
        (_c = appCountQuery === null || appCountQuery === void 0 ? void 0 : appCountQuery.data) === null || _c === void 0 ? void 0 : _c.limit,
        context,
        handleViewLogs,
        canUpdate,
        isAppDetailsPage,
        handleUpdate,
        handleDisable,
        handleEnable,
        handleUninstall,
    ]);
    return { isLoading, isAdminUser, sections: menuSections };
};
exports.useAppMenu = useAppMenu;
