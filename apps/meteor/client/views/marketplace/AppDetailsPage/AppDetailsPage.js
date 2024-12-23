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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const AppDetailsPageHeader_1 = __importDefault(require("./AppDetailsPageHeader"));
const AppDetailsPageLoading_1 = __importDefault(require("./AppDetailsPageLoading"));
const AppDetailsPageTabs_1 = __importDefault(require("./AppDetailsPageTabs"));
const handleAPIError_1 = require("../helpers/handleAPIError");
const useAppInfo_1 = require("../hooks/useAppInfo");
const AppDetails_1 = __importDefault(require("./tabs/AppDetails"));
const AppLogs_1 = __importDefault(require("./tabs/AppLogs"));
const AppReleases_1 = __importDefault(require("./tabs/AppReleases"));
const AppRequests_1 = __importDefault(require("./tabs/AppRequests/AppRequests"));
const AppSecurity_1 = __importDefault(require("./tabs/AppSecurity/AppSecurity"));
const AppSettings_1 = __importDefault(require("./tabs/AppSettings"));
const orchestrator_1 = require("../../../apps/orchestrator");
const Page_1 = require("../../../components/Page");
const AppDetailsPage = ({ id }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const isAdminUser = (0, ui_contexts_1.usePermission)('manage-apps');
    const tab = (0, ui_contexts_1.useRouteParameter)('tab');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const appData = (0, useAppInfo_1.useAppInfo)(id, context || '');
    const handleReturn = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (!context) {
            return;
        }
        router.navigate({
            name: 'marketplace',
            params: { context, page: 'list' },
        });
    });
    const { installed, settings, privacyPolicySummary, permissions, tosLink, privacyLink, name } = appData || {};
    const isSecurityVisible = Boolean(privacyPolicySummary || permissions || tosLink || privacyLink);
    const saveAppSettings = (0, react_1.useCallback)((data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield orchestrator_1.AppClientOrchestratorInstance.setAppSettings(id, Object.values(settings || {}).map((setting) => (Object.assign(Object.assign({}, setting), { value: data[setting.id] }))));
            dispatchToastMessage({ type: 'success', message: `${name} settings saved succesfully` });
        }
        catch (e) {
            (0, handleAPIError_1.handleAPIError)(e);
        }
    }), [dispatchToastMessage, id, name, settings]);
    const reducedSettings = (0, react_1.useMemo)(() => {
        return Object.values(settings || {}).reduce((ret, { id, value, packageValue }) => (Object.assign(Object.assign({}, ret), { [id]: value !== null && value !== void 0 ? value : packageValue })), {});
    }, [settings]);
    const methods = (0, react_hook_form_1.useForm)({ values: reducedSettings });
    const { handleSubmit, reset, formState: { isDirty, isSubmitting, isSubmitted }, } = methods;
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'column', h: 'full', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('App_Info'), onClickBack: handleReturn }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { pi: 24, pbs: 24, pbe: 0, h: 'full', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { w: 'full', alignSelf: 'center', h: 'full', display: 'flex', flexDirection: 'column', children: [!appData && (0, jsx_runtime_1.jsx)(AppDetailsPageLoading_1.default, {}), appData && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AppDetailsPageHeader_1.default, { app: appData }), (0, jsx_runtime_1.jsx)(AppDetailsPageTabs_1.default, { context: context || '', installed: installed, isSecurityVisible: isSecurityVisible, settings: settings, tab: tab }), Boolean(!tab || tab === 'details') && (0, jsx_runtime_1.jsx)(AppDetails_1.default, { app: appData }), tab === 'requests' && (0, jsx_runtime_1.jsx)(AppRequests_1.default, { id: id, isAdminUser: isAdminUser }), tab === 'security' && isSecurityVisible && ((0, jsx_runtime_1.jsx)(AppSecurity_1.default, { privacyPolicySummary: privacyPolicySummary, appPermissions: permissions, tosLink: tosLink, privacyLink: privacyLink })), tab === 'releases' && (0, jsx_runtime_1.jsx)(AppReleases_1.default, { id: id }), Boolean(tab === 'settings' && settings && Object.values(settings).length) && ((0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(AppSettings_1.default, { settings: settings || {} }) }))), tab === 'logs' && (0, jsx_runtime_1.jsx)(AppLogs_1.default, { id: id })] }))] }) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset(), children: t('Cancel') }), installed && isAdminUser && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, loading: isSubmitting || isSubmitted, onClick: handleSubmit(saveAppSettings), children: t('Save_changes') }))] }) })] }));
};
exports.default = AppDetailsPage;
