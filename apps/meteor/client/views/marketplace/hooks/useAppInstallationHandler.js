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
exports.useAppInstallationHandler = useAppInstallationHandler;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const useAppsCountQuery_1 = require("./useAppsCountQuery");
const useOpenAppPermissionsReviewModal_1 = require("./useOpenAppPermissionsReviewModal");
const useExternalLink_1 = require("../../../hooks/useExternalLink");
const useCheckoutUrl_1 = require("../../admin/subscription/hooks/useCheckoutUrl");
const IframeModal_1 = __importDefault(require("../IframeModal"));
const AppInstallModal_1 = __importDefault(require("../components/AppInstallModal/AppInstallModal"));
const useAppsOrchestration_1 = require("./useAppsOrchestration");
const useOpenIncompatibleModal_1 = require("./useOpenIncompatibleModal");
const handleAPIError_1 = require("../helpers/handleAPIError");
function useAppInstallationHandler({ app, action, isAppPurchased, onDismiss, onSuccess, setIsPurchased, }) {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const routeContext = String((0, ui_contexts_1.useRouteParameter)('context'));
    const context = (0, useAppsCountQuery_1.isMarketplaceRouteContext)(routeContext) ? routeContext : 'explore';
    const appCountQuery = (0, useAppsCountQuery_1.useAppsCountQuery)(context);
    const notifyAdmins = (0, ui_contexts_1.useEndpoint)('POST', `/apps/notify-admins`);
    const openIncompatibleModal = (0, useOpenIncompatibleModal_1.useOpenIncompatibleModal)();
    const openExternalLink = (0, useExternalLink_1.useExternalLink)();
    const manageSubscriptionUrl = (0, useCheckoutUrl_1.useCheckoutUrl)()({ target: 'user-page', action: 'buy_more' });
    const closeModal = (0, react_1.useCallback)(() => {
        setModal(null);
        onDismiss();
    }, [onDismiss, setModal]);
    const success = (0, react_1.useCallback)((appPermissions) => {
        setModal(null);
        onSuccess(action, appPermissions);
    }, [action, onSuccess, setModal]);
    const openPermissionModal = (0, useOpenAppPermissionsReviewModal_1.useOpenAppPermissionsReviewModal)({ app, onCancel: closeModal, onConfirm: success });
    const appsOrchestrator = (0, useAppsOrchestration_1.useAppsOrchestration)();
    if (!appsOrchestrator) {
        throw new Error('Apps orchestrator is not available');
    }
    const acquireApp = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        if (action === 'purchase' && !isAppPurchased) {
            try {
                const data = yield appsOrchestrator.buildExternalUrl(app.id, app.purchaseType, false);
                setModal((0, jsx_runtime_1.jsx)(IframeModal_1.default, { url: data.url, cancel: onDismiss, confirm: () => {
                        setIsPurchased(true);
                        openPermissionModal();
                    } }));
            }
            catch (error) {
                (0, handleAPIError_1.handleAPIError)(error);
            }
            return;
        }
        openPermissionModal();
    }), [action, isAppPurchased, openPermissionModal, appsOrchestrator, app.id, app.purchaseType, setModal, onDismiss, setIsPurchased]);
    return (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        if (app === null || app === void 0 ? void 0 : app.versionIncompatible) {
            openIncompatibleModal(app, action, closeModal);
            return;
        }
        if (action === 'request') {
            const requestConfirmAction = (postMessage) => {
                setModal(null);
                dispatchToastMessage({ type: 'success', message: 'App request submitted' });
                notifyAdmins({
                    appId: app.id,
                    appName: app.name,
                    appVersion: app.marketplaceVersion,
                    message: typeof postMessage.message === 'string' ? postMessage.message : '',
                });
                success();
            };
            try {
                const data = yield appsOrchestrator.buildExternalAppRequest(app.id);
                setModal((0, jsx_runtime_1.jsx)(IframeModal_1.default, { url: data.url, wrapperHeight: 'x460', cancel: onDismiss, confirm: requestConfirmAction }));
            }
            catch (error) {
                (0, handleAPIError_1.handleAPIError)(error);
            }
            return;
        }
        if (!appCountQuery.data) {
            return;
        }
        if (appCountQuery.data.hasUnlimitedApps) {
            return acquireApp();
        }
        setModal((0, jsx_runtime_1.jsx)(AppInstallModal_1.default, { enabled: appCountQuery.data.enabled, limit: appCountQuery.data.limit, appName: app.name, handleClose: closeModal, handleConfirm: acquireApp, handleEnableUnlimitedApps: () => {
                openExternalLink(manageSubscriptionUrl);
                setModal(null);
            } }));
    }), [
        app,
        action,
        appCountQuery.data,
        setModal,
        closeModal,
        acquireApp,
        openIncompatibleModal,
        dispatchToastMessage,
        notifyAdmins,
        success,
        appsOrchestrator,
        onDismiss,
        openExternalLink,
        manageSubscriptionUrl,
    ]);
}
