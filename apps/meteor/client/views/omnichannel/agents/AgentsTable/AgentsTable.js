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
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AddAgent_1 = __importDefault(require("./AddAgent"));
const AgentsTableRow_1 = __importDefault(require("./AgentsTableRow"));
const FilterByText_1 = __importDefault(require("../../../../components/FilterByText"));
const GenericNoResults_1 = __importDefault(require("../../../../components/GenericNoResults/GenericNoResults"));
const GenericTable_1 = require("../../../../components/GenericTable");
const usePagination_1 = require("../../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../../components/GenericTable/hooks/useSort");
const useAgentsQuery_1 = require("../hooks/useAgentsQuery");
const useQuery_1 = require("../hooks/useQuery");
// TODO: missing error state
const AgentsTable = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('name');
    const [text, setText] = (0, react_1.useState)('');
    const debouncedSort = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => [sortBy, sortDirection], [sortBy, sortDirection]), 500);
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage, setCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const query = (0, useQuery_1.useQuery)({ text, current, itemsPerPage }, debouncedSort);
    const { data, isSuccess, isLoading, refetch } = (0, useAgentsQuery_1.useAgentsQuery)(query);
    const [defaultQuery] = (0, react_1.useState)((0, react_query_1.hashQueryKey)([query]));
    const queryHasChanged = defaultQuery !== (0, react_query_1.hashQueryKey)([query]);
    const onHeaderClick = (0, fuselage_hooks_1.useMutableCallback)((id) => {
        if (sortBy === id) {
            setSort(id, sortDirection === 'asc' ? 'desc' : 'asc');
            return;
        }
        setSort(id, 'asc');
    });
    const mediaQuery = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, sort: 'name', active: sortBy === 'name', onClick: onHeaderClick, children: t('Name') }), mediaQuery && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, sort: 'username', active: sortBy === 'username', onClick: onHeaderClick, children: t('Username') })), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, sort: 'emails.address', active: sortBy === 'emails.address', onClick: onHeaderClick, children: t('Email') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, sort: 'statusLivechat', active: sortBy === 'statusLivechat', onClick: onHeaderClick, children: t('Livechat_status') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x60', children: t('Remove') })] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AddAgent_1.default, { reload: refetch }), ((isSuccess && (data === null || data === void 0 ? void 0 : data.users.length) > 0) || queryHasChanged) && ((0, jsx_runtime_1.jsx)(FilterByText_1.default, { value: text, onChange: (event) => setText(event.target.value) })), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: mediaQuery ? 4 : 3 }) })] })), isSuccess && (data === null || data === void 0 ? void 0 : data.users.length) === 0 && queryHasChanged && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && data.users.length === 0 && !queryHasChanged && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'headset', title: t('No_agents_yet'), description: t('No_agents_yet_description'), linkHref: 'https://go.rocket.chat/i/omnichannel-docs', linkText: t('Learn_more_about_agents') })), isSuccess && (data === null || data === void 0 ? void 0 : data.users.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { "aria-busy": isLoading, "data-qa-id": 'agents-table', children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { "data-qa": 'GenericTableAgentInfoBody', children: data === null || data === void 0 ? void 0 : data.users.map((user) => (0, jsx_runtime_1.jsx)(AgentsTableRow_1.default, { user: user, mediaQuery: mediaQuery }, user._id)) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: setItemsPerPage, onSetCurrent: setCurrent }, paginationProps))] }))] }));
};
exports.default = AgentsTable;
