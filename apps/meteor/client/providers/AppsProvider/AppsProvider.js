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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const storeQueryFunction_1 = require("./storeQueryFunction");
const orchestrator_1 = require("../../apps/orchestrator");
const AppsContext_1 = require("../../contexts/AppsContext");
const useLicense_1 = require("../../hooks/useLicense");
const asyncState_1 = require("../../lib/asyncState");
const useAppsCountQuery_1 = require("../../views/marketplace/hooks/useAppsCountQuery");
const getAppState = (loading, apps, error) => {
    if (error) {
        return {
            phase: asyncState_1.AsyncStatePhase.REJECTED,
            value: undefined,
            error,
        };
    }
    return {
        phase: loading ? asyncState_1.AsyncStatePhase.LOADING : asyncState_1.AsyncStatePhase.RESOLVED,
        value: { apps: apps || [] },
        error,
    };
};
const AppsProvider = ({ children }) => {
    var _a, _b;
    const isAdminUser = (0, ui_contexts_1.usePermission)('manage-apps');
    const queryClient = (0, react_query_1.useQueryClient)();
    const { isLoading: isLicenseInformationLoading, data: { license, limits } = {} } = (0, useLicense_1.useLicense)({ loadValues: true });
    const isEnterprise = isLicenseInformationLoading ? undefined : !!license;
    const invalidateAppsCountQuery = (0, useAppsCountQuery_1.useInvalidateAppsCountQueryCallback)();
    const invalidateLicenseQuery = (0, useLicense_1.useInvalidateLicense)();
    const stream = (0, ui_contexts_1.useStream)('apps');
    const invalidate = (0, fuselage_hooks_1.useDebouncedCallback)(() => {
        queryClient.invalidateQueries(['marketplace', 'apps-instance']);
        invalidateAppsCountQuery();
    }, 100, []);
    (0, react_1.useEffect)(() => {
        return stream('apps', ([key]) => {
            if (['app/added', 'app/removed', 'app/updated', 'app/statusUpdate', 'app/settingUpdated'].includes(key)) {
                invalidate();
            }
            if (['app/added', 'app/removed'].includes(key) && !isEnterprise) {
                invalidateLicenseQuery();
            }
        });
    }, [invalidate, invalidateLicenseQuery, isEnterprise, stream]);
    const marketplace = (0, react_query_1.useQuery)(['marketplace', 'apps-marketplace', isAdminUser], () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield orchestrator_1.AppClientOrchestratorInstance.getAppsFromMarketplace(isAdminUser);
        queryClient.invalidateQueries(['marketplace', 'apps-stored']);
        if (result.error && typeof result.error === 'string') {
            throw new Error(result.error);
        }
        return result.apps;
    }), {
        staleTime: Infinity,
        keepPreviousData: true,
        onSettled: () => queryClient.invalidateQueries(['marketplace', 'apps-stored']),
    });
    const instance = (0, react_query_1.useQuery)(['marketplace', 'apps-instance', isAdminUser], () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield orchestrator_1.AppClientOrchestratorInstance.getInstalledApps().then((result) => result.map((current) => (Object.assign(Object.assign({}, current), { installed: true }))));
        return result;
    }), {
        staleTime: Infinity,
        refetchOnMount: 'always',
        onSettled: () => queryClient.invalidateQueries(['marketplace', 'apps-stored']),
    });
    const { isLoading: isMarketplaceDataLoading, data: marketplaceData } = (0, react_query_1.useQuery)(['marketplace', 'apps-stored', instance.data, marketplace.data], () => (0, storeQueryFunction_1.storeQueryFunction)(marketplace, instance), {
        enabled: marketplace.isFetched && instance.isFetched,
        keepPreviousData: true,
    });
    const [marketplaceAppsData, installedAppsData, privateAppsData] = marketplaceData || [];
    return ((0, jsx_runtime_1.jsx)(AppsContext_1.AppsContext.Provider, { children: children, value: {
            installedApps: getAppState(isMarketplaceDataLoading, installedAppsData),
            marketplaceApps: getAppState(isMarketplaceDataLoading, marketplaceAppsData, marketplace.error instanceof Error ? marketplace.error : undefined),
            privateApps: getAppState(isMarketplaceDataLoading, privateAppsData),
            reload: () => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([queryClient.invalidateQueries(['marketplace'])]);
            }),
            orchestrator: orchestrator_1.AppClientOrchestratorInstance,
            privateAppsEnabled: ((_b = (_a = limits === null || limits === void 0 ? void 0 : limits.privateApps) === null || _a === void 0 ? void 0 : _a.max) !== null && _b !== void 0 ? _b : 0) !== 0,
        } }));
};
exports.default = AppsProvider;
