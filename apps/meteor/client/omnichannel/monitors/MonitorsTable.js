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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const FilterByText_1 = __importDefault(require("../../components/FilterByText"));
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const GenericNoResults_1 = __importDefault(require("../../components/GenericNoResults"));
const GenericTable_1 = require("../../components/GenericTable");
const usePagination_1 = require("../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../components/GenericTable/hooks/useSort");
const queryClient_1 = require("../../lib/queryClient");
const MonitorsTable = () => {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const [text, setText] = (0, react_1.useState)('');
    const [username, setUsername] = (0, react_1.useState)('');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const pagination = (0, usePagination_1.usePagination)();
    const sort = (0, useSort_1.useSort)('name');
    const getMonitors = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/monitors');
    // TODO: implement endpoints for monitors add/remove
    const removeMonitor = (0, ui_contexts_1.useMethod)('livechat:removeMonitor');
    const addMonitor = (0, ui_contexts_1.useMethod)('livechat:addMonitor');
    const { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = pagination, paginationProps = __rest(pagination, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const { sortBy, sortDirection, setSort } = sort;
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => (Object.assign(Object.assign({ text, sort: `{ "${sortBy}": ${sortDirection === 'asc' ? 1 : -1} }` }, (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }))), [text, itemsPerPage, current, sortBy, sortDirection]), 500);
    const { data, refetch, isLoading, isSuccess, isError } = (0, react_query_1.useQuery)(['omnichannel', 'monitors', query], () => getMonitors(query));
    const [defaultQuery] = (0, react_1.useState)((0, react_query_1.hashQueryKey)([query]));
    const queryHasChanged = defaultQuery !== (0, react_query_1.hashQueryKey)([query]);
    const addMutation = (0, react_query_1.useMutation)({
        mutationFn: (username) => __awaiter(void 0, void 0, void 0, function* () {
            yield addMonitor(username);
            yield queryClient_1.queryClient.invalidateQueries(['omnichannel', 'monitors']);
        }),
        onSuccess: () => {
            setUsername('');
            dispatchToastMessage({ type: 'success', message: t('Monitor_added') });
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const handleAdd = () => {
        addMutation.mutate(username);
    };
    const handleRemove = (username) => {
        const onDeleteMonitor = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield removeMonitor(username);
                dispatchToastMessage({ type: 'success', message: t('Monitor_removed') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            queryClient_1.queryClient.invalidateQueries(['omnichannel', 'monitors']);
            setModal();
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', "data-qa-id": 'manage-monitors-confirm-remove', onConfirm: onDeleteMonitor, onCancel: () => setModal(), confirmText: t('Delete') }));
    };
    const headers = (0, react_1.useMemo)(() => [
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'name', onClick: setSort, children: t('Name') }, 'name'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'username', onClick: setSort, children: t('Username') }, 'username'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'email', onClick: setSort, children: t('Email') }, 'email'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 40 }, 'spacer'),
    ], [setSort, sortBy, sortDirection, t]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Username') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(ui_client_1.UserAutoComplete, { name: 'monitor', value: username, onChange: setUsername }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !username, loading: addMutation.isLoading, onClick: () => handleAdd(), mis: 8, children: t('Add_monitor') })] })] }) }), ((isSuccess && (data === null || data === void 0 ? void 0 : data.monitors.length) > 0) || queryHasChanged) && ((0, jsx_runtime_1.jsx)(FilterByText_1.default, { value: text, onChange: (event) => setText(event.target.value) })), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 4 }) })] })), isSuccess && data.monitors.length === 0 && queryHasChanged && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && data.monitors.length === 0 && !queryHasChanged && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'shield-blank', title: t('No_monitors_yet'), description: t('No_monitors_yet_description'), linkHref: 'https://go.rocket.chat/i/omnichannel-docs', linkText: t('Learn_more_about_monitors') })), isSuccess && data.monitors.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { "aria-busy": isLoading, "aria-live": 'assertive', "data-qa-id": 'manage-monitors-table', children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (_a = data.monitors) === null || _a === void 0 ? void 0 : _a.map((monitor) => ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, width: 'full', "data-qa-id": monitor.name, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: monitor.name }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: monitor.username }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: monitor.email }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'trash', small: true, title: t('Remove'), onClick: () => handleRemove(monitor.username) }) })] }, monitor._id))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] })), isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => refetch(), children: t('Reload_page') }) })] }))] }));
};
exports.default = MonitorsTable;
