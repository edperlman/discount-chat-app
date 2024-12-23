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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AdminInviteUsers_1 = __importDefault(require("./AdminInviteUsers"));
const AdminUserCreated_1 = __importDefault(require("./AdminUserCreated"));
const AdminUserForm_1 = __importDefault(require("./AdminUserForm"));
const AdminUserFormWithData_1 = __importDefault(require("./AdminUserFormWithData"));
const AdminUserInfoWithData_1 = __importDefault(require("./AdminUserInfoWithData"));
const AdminUserUpgrade_1 = __importDefault(require("./AdminUserUpgrade"));
const UsersPageHeaderContent_1 = __importDefault(require("./UsersPageHeaderContent"));
const UsersTable_1 = __importDefault(require("./UsersTable"));
const useFilteredUsers_1 = __importDefault(require("./hooks/useFilteredUsers"));
const usePendingUsersCount_1 = __importDefault(require("./hooks/usePendingUsersCount"));
const useSeatsCap_1 = require("./useSeatsCap");
const Contextualbar_1 = require("../../../components/Contextualbar");
const usePagination_1 = require("../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../components/GenericTable/hooks/useSort");
const Page_1 = require("../../../components/Page");
const useLicenseLimitsByBehavior_1 = require("../../../hooks/useLicenseLimitsByBehavior");
const useShouldPreventAction_1 = require("../../../hooks/useShouldPreventAction");
const useCheckoutUrl_1 = require("../subscription/hooks/useCheckoutUrl");
const AdminUsersPage = () => {
    var _a, _b;
    const t = (0, ui_contexts_1.useTranslation)();
    const seatsCap = (0, useSeatsCap_1.useSeatsCap)();
    const isSeatsCapExceeded = (0, useShouldPreventAction_1.useShouldPreventAction)('activeUsers');
    const { prevent_action: preventAction } = (_a = (0, useLicenseLimitsByBehavior_1.useLicenseLimitsByBehavior)()) !== null && _a !== void 0 ? _a : {};
    const manageSubscriptionUrl = (0, useCheckoutUrl_1.useCheckoutUrl)();
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const isCreateUserDisabled = (0, useShouldPreventAction_1.useShouldPreventAction)('activeUsers');
    const getRoles = (0, ui_contexts_1.useEndpoint)('GET', '/v1/roles.list');
    const { data, error } = (0, react_query_1.useQuery)(['roles'], () => __awaiter(void 0, void 0, void 0, function* () { return getRoles(); }));
    const paginationData = (0, usePagination_1.usePagination)();
    const sortData = (0, useSort_1.useSort)('name');
    const [tab, setTab] = (0, react_1.useState)('all');
    const [userFilters, setUserFilters] = (0, react_1.useState)({ text: '', roles: [] });
    const searchTerm = (0, fuselage_hooks_1.useDebouncedValue)(userFilters.text, 500);
    const prevSearchTerm = (0, react_1.useRef)('');
    const filteredUsersQueryResult = (0, useFilteredUsers_1.default)({
        searchTerm,
        prevSearchTerm,
        sortData,
        paginationData,
        tab,
        selectedRoles: (0, react_1.useMemo)(() => userFilters.roles.map((role) => role.id), [userFilters.roles]),
    });
    const pendingUsersCount = (0, usePendingUsersCount_1.default)((_b = filteredUsersQueryResult.data) === null || _b === void 0 ? void 0 : _b.users);
    const handleReload = () => {
        seatsCap === null || seatsCap === void 0 ? void 0 : seatsCap.reload();
        filteredUsersQueryResult === null || filteredUsersQueryResult === void 0 ? void 0 : filteredUsersQueryResult.refetch();
    };
    const handleTabChange = (tab) => {
        setTab(tab);
        paginationData.setCurrent(0);
        sortData.setSort(tab === 'pending' ? 'active' : 'name', 'asc');
    };
    (0, react_1.useEffect)(() => {
        prevSearchTerm.current = searchTerm;
    }, [searchTerm]);
    const isRoutePrevented = (0, react_1.useMemo)(() => context && ['new', 'invite'].includes(context) && isCreateUserDisabled, [context, isCreateUserDisabled]);
    const toTranslationKey = (key) => t(`subscription.callout.${key}`);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Users'), children: (0, jsx_runtime_1.jsx)(UsersPageHeaderContent_1.default, { isSeatsCapExceeded: isSeatsCapExceeded, seatsCap: seatsCap }) }), (preventAction === null || preventAction === void 0 ? void 0 : preventAction.includes('activeUsers')) && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', title: t('subscription.callout.servicesDisruptionsOccurring'), mbe: 19, mi: 24, children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'subscription.callout.description.limitsExceeded', count: preventAction.length, children: ["Your workspace exceeded the ", (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: { val: preventAction.map(toTranslationKey) } }), " license limit.", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: manageSubscriptionUrl({
                                        target: 'callout',
                                        action: 'prevent_action',
                                        limits: preventAction.join(','),
                                    }), children: "Manage your subscription" }), "to increase limits."] }) })), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: !tab || tab === 'all', onClick: () => handleTabChange('all'), children: t('All') }), (0, jsx_runtime_1.jsxs)(fuselage_1.TabsItem, { selected: tab === 'pending', onClick: () => handleTabChange('pending'), display: 'flex', flexDirection: 'row', children: [`${t('Pending')} `, pendingUsersCount.isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'circle', height: 'x16', width: 'x16', mis: 8 }), pendingUsersCount.isSuccess && `(${pendingUsersCount.data})`] }), (0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'active', onClick: () => handleTabChange('active'), children: t('Active') }), (0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'deactivated', onClick: () => handleTabChange('deactivated'), children: t('Deactivated') })] }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(UsersTable_1.default, { filteredUsersQueryResult: filteredUsersQueryResult, setUserFilters: setUserFilters, paginationData: paginationData, sortData: sortData, tab: tab, isSeatsCapExceeded: isSeatsCapExceeded, roleData: data, onReload: handleReload }) })] }), context && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { children: (0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [context === 'upgrade' && (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarIcon, { name: 'user-plus' }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarTitle, { children: [context === 'info' && t('User_Info'), context === 'edit' && t('Edit_User'), (context === 'new' || context === 'created') && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'user-plus', size: 20 }), " ", t('New_user')] })), context === 'invite' && t('Invite_Users')] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => router.navigate('/admin/users') })] }), context === 'info' && id && (0, jsx_runtime_1.jsx)(AdminUserInfoWithData_1.default, { uid: id, onReload: handleReload, tab: tab }), context === 'edit' && id && ((0, jsx_runtime_1.jsx)(AdminUserFormWithData_1.default, { uid: id, onReload: handleReload, context: context, roleData: data, roleError: error })), !isRoutePrevented && context === 'new' && ((0, jsx_runtime_1.jsx)(AdminUserForm_1.default, { onReload: handleReload, context: context, roleData: data, roleError: error })), !isRoutePrevented && context === 'created' && id && (0, jsx_runtime_1.jsx)(AdminUserCreated_1.default, { uid: id }), !isRoutePrevented && context === 'invite' && (0, jsx_runtime_1.jsx)(AdminInviteUsers_1.default, {}), isRoutePrevented && (0, jsx_runtime_1.jsx)(AdminUserUpgrade_1.default, {})] }) }))] }));
};
exports.default = AdminUsersPage;
