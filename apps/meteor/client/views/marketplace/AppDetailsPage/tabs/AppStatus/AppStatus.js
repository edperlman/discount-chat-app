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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const semver_1 = __importDefault(require("semver"));
const AppStatusPriceDisplay_1 = __importDefault(require("./AppStatusPriceDisplay"));
const useHasLicenseModule_1 = require("../../../../../hooks/useHasLicenseModule");
const useIsEnterprise_1 = require("../../../../../hooks/useIsEnterprise");
const AddonRequiredModal_1 = __importDefault(require("../../../AppsList/AddonRequiredModal"));
const helpers_1 = require("../../../helpers");
const useAppInstallationHandler_1 = require("../../../hooks/useAppInstallationHandler");
const useMarketplaceActions_1 = require("../../../hooks/useMarketplaceActions");
const AppStatus = (_a) => {
    var _b, _c, _d;
    var { app, showStatus = true, isAppDetailsPage, installed } = _a, props = __rest(_a, ["app", "showStatus", "isAppDetailsPage", "installed"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const [endUserRequested, setEndUserRequested] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(false));
    const [isAppPurchased, setPurchased] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(!!(app === null || app === void 0 ? void 0 : app.isPurchased)));
    const setModal = (0, ui_contexts_1.useSetModal)();
    const isAdminUser = (0, ui_contexts_1.usePermission)('manage-apps');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const { price, purchaseType, pricingPlans } = app;
    const button = (0, helpers_1.appButtonProps)(Object.assign(Object.assign({}, app), { isAdminUser, endUserRequested }));
    const isAppRequestsPage = context === 'requested';
    const shouldShowPriceDisplay = isAppDetailsPage && button && !app.isEnterpriseOnly;
    const canUpdate = installed && (app === null || app === void 0 ? void 0 : app.version) && (app === null || app === void 0 ? void 0 : app.marketplaceVersion) && semver_1.default.lt(app === null || app === void 0 ? void 0 : app.version, app === null || app === void 0 ? void 0 : app.marketplaceVersion);
    const { data } = (0, useIsEnterprise_1.useIsEnterprise)();
    const isEnterprise = (_b = data === null || data === void 0 ? void 0 : data.isEnterprise) !== null && _b !== void 0 ? _b : false;
    const appAddon = app.addon;
    const workspaceHasAddon = (0, useHasLicenseModule_1.useHasLicenseModule)(appAddon);
    const statuses = (0, helpers_1.appMultiStatusProps)(app, isAppDetailsPage, context || '', isEnterprise);
    const totalSeenRequests = (_c = app === null || app === void 0 ? void 0 : app.appRequestStats) === null || _c === void 0 ? void 0 : _c.totalSeen;
    const totalUnseenRequests = (_d = app === null || app === void 0 ? void 0 : app.appRequestStats) === null || _d === void 0 ? void 0 : _d.totalUnseen;
    const action = button === null || button === void 0 ? void 0 : button.action;
    const marketplaceActions = (0, useMarketplaceActions_1.useMarketplaceActions)();
    const confirmAction = (0, react_1.useCallback)((action, permissionsGranted) => __awaiter(void 0, void 0, void 0, function* () {
        if (action) {
            if (action !== 'request') {
                yield marketplaceActions[action](Object.assign(Object.assign({}, app), { permissionsGranted }));
            }
            else {
                setEndUserRequested(true);
            }
        }
        setLoading(false);
    }), [app, marketplaceActions, setLoading]);
    const cancelAction = (0, react_1.useCallback)(() => {
        setLoading(false);
        setModal(null);
    }, [setLoading, setModal]);
    const appInstallationHandler = (0, useAppInstallationHandler_1.useAppInstallationHandler)({
        app,
        action: action || 'purchase',
        isAppPurchased,
        onDismiss: cancelAction,
        onSuccess: confirmAction,
        setIsPurchased: setPurchased,
    });
    const handleAcquireApp = (0, react_1.useCallback)(() => {
        setLoading(true);
        if (isAdminUser && appAddon && !workspaceHasAddon) {
            const actionType = (button === null || button === void 0 ? void 0 : button.action) === 'update' ? 'update' : 'install';
            return setModal((0, jsx_runtime_1.jsx)(AddonRequiredModal_1.default, { actionType: actionType, onDismiss: cancelAction, onInstallAnyway: appInstallationHandler }));
        }
        appInstallationHandler();
    }, [button === null || button === void 0 ? void 0 : button.action, appAddon, appInstallationHandler, cancelAction, isAdminUser, setLoading, setModal, workspaceHasAddon]);
    // @TODO we should refactor this to not use the label to determine the variant
    const getStatusVariant = (status) => {
        if (isAppRequestsPage && totalUnseenRequests && (status.label === 'request' || status.label === 'requests')) {
            return 'primary';
        }
        if (isAppRequestsPage && status.label === 'Requested') {
            return undefined;
        }
        // includes() here because the label can be 'Disabled' or 'Disabled*'
        if (status.label.includes('Disabled')) {
            return 'secondary-danger';
        }
        return undefined;
    };
    const handleAppRequestsNumber = (status) => {
        if ((status.label === 'request' || status.label === 'requests') && !installed && isAppRequestsPage) {
            let numberOfRequests = 0;
            if (totalUnseenRequests >= 0) {
                numberOfRequests += totalUnseenRequests;
            }
            if (totalSeenRequests >= 0) {
                numberOfRequests += totalSeenRequests;
            }
            return numberOfRequests;
        }
        return null;
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({}, props, { display: 'flex', alignItems: 'center', mie: 8, children: [button && isAppDetailsPage && (!installed || canUpdate) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 'x4', invisible: !showStatus && !loading, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: button.icon, primary: true, small: true, loading: loading, disabled: action === 'request' && ((app === null || app === void 0 ? void 0 : app.requestedEndUser) || endUserRequested), onClick: handleAcquireApp, mie: 8, children: t(button.label.replace(' ', '_')) }), shouldShowPriceDisplay && !installed && ((0, jsx_runtime_1.jsx)(AppStatusPriceDisplay_1.default, { purchaseType: purchaseType, pricingPlans: pricingPlans, price: price, showType: false }))] })), statuses === null || statuses === void 0 ? void 0 : statuses.map((status, index) => ((0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inlineEnd: index !== statuses.length - 1 ? 8 : undefined, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Tag, { "data-qa-type": 'app-status-tag', variant: getStatusVariant(status), title: status.tooltipText ? status.tooltipText : '', children: [handleAppRequestsNumber(status), " ", t(status.label)] }) }, index)))] })));
};
exports.default = (0, react_1.memo)(AppStatus);
