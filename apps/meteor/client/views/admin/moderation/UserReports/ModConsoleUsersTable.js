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
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ModConsoleUserTableRow_1 = __importDefault(require("./ModConsoleUserTableRow"));
const GenericNoResults_1 = __importDefault(require("../../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../../components/GenericTable");
const usePagination_1 = require("../../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../../components/GenericTable/hooks/useSort");
const ModerationFilter_1 = __importDefault(require("../helpers/ModerationFilter"));
const ModConsoleUsersTable = () => {
    const [text, setText] = (0, react_1.useState)('');
    const router = (0, ui_contexts_1.useRouter)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const isDesktopOrLarger = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('reports.ts');
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const [dateRange, setDateRange] = (0, react_1.useState)({
        start: '',
        end: '',
    });
    const { start, end } = dateRange;
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => ({
        selector: text,
        sort: JSON.stringify({ [sortBy]: sortDirection === 'asc' ? 1 : -1 }),
        count: itemsPerPage,
        offset: current,
        latest: end ? `${new Date(end).toISOString().slice(0, 10)}T23:59:59.999Z` : undefined,
        oldest: start ? `${new Date(start).toISOString().slice(0, 10)}T00:00:00.000Z` : undefined,
    }), [current, end, itemsPerPage, sortBy, sortDirection, start, text]), 500);
    const getReports = (0, ui_contexts_1.useEndpoint)('GET', '/v1/moderation.userReports');
    const { data, isLoading, isSuccess, isError, refetch } = (0, react_query_1.useQuery)(['moderation', 'userReports', 'fetchAll', query], () => getReports(query), {
        keepPreviousData: true,
    });
    const handleClick = (0, fuselage_hooks_1.useMutableCallback)((id) => {
        router.navigate({
            pattern: '/admin/moderation/:tab?/:context?/:id?',
            params: { tab: 'users', context: 'info', id },
        });
    });
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'reports.reportedUser.username', onClick: setSort, sort: 'reports.reportedUser.username', children: t('User') }, 'name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { active: sortBy === 'reports.reportedUser.createdAt', onClick: setSort, sort: 'reports.reportedUser.createdAt', direction: sortDirection, children: t('Created_at') }, 'created'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, children: t('Email') }, 'email'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'reports.ts', onClick: setSort, sort: 'reports.ts', children: t('Moderation_Report_date') }, 'postdate'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'count', onClick: setSort, sort: 'count', children: t('Moderation_Reports') }, 'reports'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { width: 'x48' }, 'actions')] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ModerationFilter_1.default, { text: text, setText: setText, setDateRange: setDateRange }), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: isLoading && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 6 }) })] })), isSuccess && data.reports.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data.reports.map((report) => {
                                    var _a;
                                    return ((0, jsx_runtime_1.jsx)(ModConsoleUserTableRow_1.default, { report: report, onClick: handleClick, isDesktopOrLarger: isDesktopOrLarger }, (_a = report.reportedUser) === null || _a === void 0 ? void 0 : _a._id));
                                }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ current: current, divider: true, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] })), isSuccess && data.reports.length === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => refetch(), children: t('Reload_page') }) })] }))] }));
};
exports.default = ModConsoleUsersTable;
