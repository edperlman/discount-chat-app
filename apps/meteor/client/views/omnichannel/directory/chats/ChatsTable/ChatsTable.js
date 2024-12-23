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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ChatsTableFilter_1 = __importDefault(require("./ChatsTableFilter"));
const ChatsTableRow_1 = __importDefault(require("./ChatsTableRow"));
const useChatsQuery_1 = require("./useChatsQuery");
const GenericNoResults_1 = __importDefault(require("../../../../../components/GenericNoResults/GenericNoResults"));
const GenericTable_1 = require("../../../../../components/GenericTable");
const usePagination_1 = require("../../../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../../../components/GenericTable/hooks/useSort");
const useOmnichannelPriorities_1 = require("../../../../../omnichannel/hooks/useOmnichannelPriorities");
const useCurrentChats_1 = require("../../../currentChats/hooks/useCurrentChats");
const ChatsContext_1 = require("../../contexts/ChatsContext");
const ChatsTable = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const canRemoveClosedChats = (0, ui_contexts_1.usePermission)('remove-closed-livechat-room');
    const { filtersQuery: filters } = (0, ChatsContext_1.useChatsContext)();
    const { enabled: isPriorityEnabled } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    const chatsQuery = (0, useChatsQuery_1.useChatsQuery)();
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('lm', 'desc');
    const query = (0, react_1.useMemo)(() => chatsQuery(filters, [sortBy, sortDirection], current, itemsPerPage), [itemsPerPage, filters, sortBy, sortDirection, current, chatsQuery]);
    const { data, isLoading, isSuccess, isError, refetch } = (0, useCurrentChats_1.useCurrentChats)(query);
    const [defaultQuery] = (0, react_1.useState)((0, react_query_1.hashQueryKey)([query]));
    const queryHasChanged = defaultQuery !== (0, react_query_1.hashQueryKey)([query]);
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'fname', onClick: setSort, sort: 'fname', children: t('Name') }, 'fname'), isPriorityEnabled && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'priorityWeight', onClick: setSort, sort: 'priorityWeight', alignItems: 'center', children: t('Priority') }, 'priorityWeight')), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'source.type', onClick: setSort, sort: 'source.type', children: t('Channel') }, 'source.type'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'servedBy', onClick: setSort, sort: 'servedBy', children: t('Agent') }, 'servedBy'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x100', direction: sortDirection, active: sortBy === 'verified', onClick: setSort, sort: 'verified', children: t('Verification') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'department.name', onClick: setSort, sort: 'department.name', children: t('Department') }, 'department.name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'ts', onClick: setSort, sort: 'ts', children: t('Started_At') }, 'ts'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'lm', onClick: setSort, sort: 'lm', children: t('Last_Message') }, 'lm'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'status', onClick: setSort, sort: 'status', children: t('Status') }, 'status'), canRemoveClosedChats && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x60', "data-qa": 'current-chats-header-remove' }, 'remove')] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ChatsTableFilter_1.default, {}), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: headers.props.children.filter(Boolean).length }) })] })), isSuccess && (data === null || data === void 0 ? void 0 : data.rooms.length) === 0 && queryHasChanged && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && (data === null || data === void 0 ? void 0 : data.rooms.length) === 0 && !queryHasChanged && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'message', title: t('No_chats_yet'), description: t('No_chats_yet_description'), linkHref: 'https://go.rocket.chat/i/omnichannel-docs', linkText: t('Learn_more_about_conversations') })), isSuccess && (data === null || data === void 0 ? void 0 : data.rooms.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { fixed: false, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data === null || data === void 0 ? void 0 : data.rooms.map((room) => (0, jsx_runtime_1.jsx)(ChatsTableRow_1.default, Object.assign({}, room), room._id)) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] })), isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => refetch(), children: t('Reload_page') }) })] }))] }));
};
exports.default = ChatsTable;
