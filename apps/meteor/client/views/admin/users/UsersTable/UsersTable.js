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
const UsersTableFilters_1 = __importDefault(require("./UsersTableFilters"));
const UsersTableRow_1 = __importDefault(require("./UsersTableRow"));
const GenericNoResults_1 = __importDefault(require("../../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../../components/GenericTable");
const useVoipExtensionPermission_1 = require("../voip/hooks/useVoipExtensionPermission");
const UsersTable = ({ filteredUsersQueryResult, setUserFilters, roleData, tab, onReload, paginationData, sortData, isSeatsCapExceeded, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const breakpoints = (0, fuselage_hooks_1.useBreakpoints)();
    const isMobile = !breakpoints.includes('xl');
    const isLaptop = !breakpoints.includes('xxl');
    const { data, isLoading, isError, isSuccess } = filteredUsersQueryResult;
    const { current, itemsPerPage, setItemsPerPage, setCurrent } = paginationData, paginationProps = __rest(paginationData, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const { sortBy, sortDirection, setSort } = sortData;
    const canManageVoipExtension = (0, useVoipExtensionPermission_1.useVoipExtensionPermission)();
    const isKeyboardEvent = (event) => {
        return event.key !== undefined;
    };
    const handleClickOrKeyDown = (0, fuselage_hooks_1.useEffectEvent)((id, e) => {
        e.stopPropagation();
        const keyboardSubmitKeys = ['Enter', ' '];
        if (isKeyboardEvent(e) && !keyboardSubmitKeys.includes(e.key)) {
            return;
        }
        router.navigate({
            name: 'admin-users',
            params: {
                context: 'info',
                id,
            },
        });
    });
    const headers = (0, react_1.useMemo)(() => [
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'name', onClick: setSort, sort: 'name', children: t('Name') }, 'name'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'username', onClick: setSort, sort: 'username', children: t('Username') }, 'username'),
        !isLaptop && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'emails.address', onClick: setSort, sort: 'emails.address', children: t('Email') }, 'email')),
        !isLaptop && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Roles') }, 'roles'),
        tab === 'all' && !isMobile && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'status', onClick: setSort, sort: 'status', children: t('Registration_status') }, 'status')),
        tab === 'pending' && !isMobile && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'active', onClick: setSort, sort: 'active', children: t('Pending_action') }, 'action')),
        tab === 'all' && canManageVoipExtension && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x180', direction: sortDirection, active: sortBy === 'freeSwitchExtension', onClick: setSort, sort: 'freeSwitchExtension', children: t('Voice_call_extension') }, 'freeSwitchExtension')),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: tab === 'pending' ? 'x204' : 'x50' }, 'actions'),
    ], [isLaptop, isMobile, setSort, sortBy, sortDirection, t, tab, canManageVoipExtension]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(UsersTableFilters_1.default, { roleData: roleData, setUsersFilters: setUserFilters }), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 5 }) })] })), isError && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'warning', title: t('Something_went_wrong'), buttonTitle: t('Reload_page'), buttonAction: onReload })), isSuccess && data.users.length === 0 && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'user', title: t('Users_Table_Generic_No_users', {
                    postProcess: 'sprintf',
                    sprintf: [tab !== 'all' ? t(tab) : ''],
                }), description: t(`Users_Table_no_${tab}_users_description`) })), isSuccess && !!(data === null || data === void 0 ? void 0 : data.users) && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data.users.map((user) => ((0, jsx_runtime_1.jsx)(UsersTableRow_1.default, { tab: tab, user: user, isMobile: isMobile, isLaptop: isLaptop, isSeatsCapExceeded: isSeatsCapExceeded, showVoipExtension: canManageVoipExtension, onReload: onReload, onClick: handleClickOrKeyDown }, user._id))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: data.total || 0, onSetItemsPerPage: setItemsPerPage, onSetCurrent: setCurrent }, paginationProps))] }))] }));
};
exports.default = UsersTable;
