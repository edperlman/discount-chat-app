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
const RemoveSlaButton_1 = __importDefault(require("./RemoveSlaButton"));
const FilterByText_1 = __importDefault(require("../../components/FilterByText"));
const GenericNoResults_1 = __importDefault(require("../../components/GenericNoResults/GenericNoResults"));
const GenericTable_1 = require("../../components/GenericTable");
const usePagination_1 = require("../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../components/GenericTable/hooks/useSort");
const SlaTable = ({ reload }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const [filter, setFilter] = (0, react_1.useState)('');
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('name');
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => (Object.assign(Object.assign({ text: filter, sort: JSON.stringify({ [sortBy]: sortDirection === 'asc' ? 1 : -1 }) }, (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }))), [filter, itemsPerPage, current, sortBy, sortDirection]), 500);
    const getSlaData = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/sla');
    const { data, isSuccess, isLoading, refetch } = (0, react_query_1.useQuery)(['/v1/livechat/sla', query], () => getSlaData(query));
    const [defaultQuery] = (0, react_1.useState)((0, react_query_1.hashQueryKey)([query]));
    const queryHasChanged = defaultQuery !== (0, react_query_1.hashQueryKey)([query]);
    (0, react_1.useEffect)(() => {
        reload.current = refetch;
    }, [reload, refetch]);
    const handleAddNew = (0, fuselage_hooks_1.useMutableCallback)(() => router.navigate('/omnichannel/sla-policies/new'));
    const onRowClick = (0, fuselage_hooks_1.useMutableCallback)((id) => () => router.navigate(`/omnichannel/sla-policies/edit/${id}`));
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'name', onClick: setSort, sort: 'name', children: t('Name') }, 'name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'description', onClick: setSort, sort: 'description', children: t('Description') }, 'description'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'dueTimeInMinutes', onClick: setSort, sort: 'dueTimeInMinutes', children: t('Estimated_wait_time') }, 'dueTimeInMinutes'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x60', children: t('Remove') }, 'remove')] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [((isSuccess && (data === null || data === void 0 ? void 0 : data.sla.length) > 0) || queryHasChanged) && ((0, jsx_runtime_1.jsx)(FilterByText_1.default, { value: filter, onChange: (event) => setFilter(event.target.value) })), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingRow, { cols: 4 }) })] })), isSuccess && (data === null || data === void 0 ? void 0 : data.sla.length) === 0 && queryHasChanged && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && (data === null || data === void 0 ? void 0 : data.sla.length) === 0 && !queryHasChanged && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'flag', title: t('No_SLA_policies_yet'), description: t('No_SLA_policies_yet_description'), buttonTitle: t('Create_SLA_policy'), buttonAction: handleAddNew, linkHref: 'https://go.rocket.chat/i/omnichannel-docs', linkText: t('Learn_more_about_SLA_policies') })), isSuccess && (data === null || data === void 0 ? void 0 : data.sla.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data === null || data === void 0 ? void 0 : data.sla.map(({ _id, name, description, dueTimeInMinutes }) => ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, role: 'link', onClick: onRowClick(_id), action: true, "qa-user-id": _id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: name }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: description }), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: [dueTimeInMinutes, " ", t('minutes')] }), (0, jsx_runtime_1.jsx)(RemoveSlaButton_1.default, { _id: _id, reload: refetch })] }, _id))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] }))] }));
};
exports.default = SlaTable;
