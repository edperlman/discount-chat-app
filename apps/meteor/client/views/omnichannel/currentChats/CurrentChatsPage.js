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
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CustomFieldsList_1 = __importDefault(require("./CustomFieldsList"));
const FilterByText_1 = __importDefault(require("./FilterByText"));
const RemoveChatButton_1 = __importDefault(require("./RemoveChatButton"));
const useAllCustomFields_1 = require("./hooks/useAllCustomFields");
const useCurrentChats_1 = require("./hooks/useCurrentChats");
const GenericNoResults_1 = __importDefault(require("../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../components/GenericTable");
const usePagination_1 = require("../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../components/GenericTable/hooks/useSort");
const Page_1 = require("../../../components/Page");
const useIsOverMacLimit_1 = require("../../../hooks/omnichannel/useIsOverMacLimit");
const RoomActivityIcon_1 = require("../../../omnichannel/components/RoomActivityIcon");
const useOmnichannelPriorities_1 = require("../../../omnichannel/hooks/useOmnichannelPriorities");
const PriorityIcon_1 = require("../../../omnichannel/priorities/PriorityIcon");
const sortDir = (sortDir) => (sortDir === 'asc' ? 1 : -1);
const currentChatQuery = ({ guest, servedBy, department, status, from, to, tags }, customFields, [column, direction], current, itemsPerPage) => {
    const query = Object.assign(Object.assign(Object.assign(Object.assign({}, (guest && { roomName: guest })), { sort: JSON.stringify({
            [column]: sortDir(direction),
            ts: column === 'ts' ? sortDir(direction) : undefined,
        }) }), (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }));
    if (from || to) {
        query.createdAt = JSON.stringify(Object.assign(Object.assign({}, (from && {
            start: (0, moment_1.default)(new Date(from)).set({ hour: 0, minutes: 0, seconds: 0 }).toISOString(),
        })), (to && {
            end: (0, moment_1.default)(new Date(to)).set({ hour: 23, minutes: 59, seconds: 59 }).toISOString(),
        })));
    }
    if (status !== 'all') {
        query.open = status === 'opened' || status === 'onhold' || status === 'queued';
        query.onhold = status === 'onhold';
        query.queued = status === 'queued';
    }
    if (servedBy && servedBy !== 'all') {
        query.agents = [servedBy];
    }
    if (department && department !== 'all') {
        query.departmentId = department;
    }
    if (tags && tags.length > 0) {
        query.tags = tags;
    }
    if (customFields && Object.keys(customFields).length > 0) {
        const customFieldsQuery = Object.fromEntries(Object.entries(customFields).filter((item) => item[1] !== undefined && item[1] !== ''));
        if (Object.keys(customFieldsQuery).length > 0) {
            query.customFields = JSON.stringify(customFieldsQuery);
        }
    }
    return query;
};
const CurrentChatsPage = ({ id, onRowClick }) => {
    const isWorkspaceOverMacLimit = (0, useIsOverMacLimit_1.useIsOverMacLimit)();
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('ts', 'desc');
    const [customFields, setCustomFields] = (0, react_1.useState)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const directoryPath = (0, ui_contexts_1.useRouter)().buildRoutePath('/omnichannel-directory');
    const canRemoveClosedChats = (0, ui_contexts_1.usePermission)('remove-closed-livechat-room');
    const { enabled: isPriorityEnabled } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    const { data: allCustomFields } = (0, useAllCustomFields_1.useAllCustomFields)();
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage, setCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const [params, setParams] = (0, react_1.useState)({
        guest: '',
        fname: '',
        servedBy: '',
        status: 'all',
        department: '',
        from: '',
        to: '',
        tags: [],
    });
    const hasCustomFields = (0, react_1.useMemo)(() => { var _a; return !!((_a = allCustomFields === null || allCustomFields === void 0 ? void 0 : allCustomFields.customFields) === null || _a === void 0 ? void 0 : _a.find((customField) => customField.scope === 'room')); }, [allCustomFields]);
    const query = (0, react_1.useMemo)(() => currentChatQuery(params, customFields, [sortBy, sortDirection], current, itemsPerPage), [customFields, itemsPerPage, params, sortBy, sortDirection, current]);
    const { data, isLoading, isSuccess } = (0, useCurrentChats_1.useCurrentChats)(query);
    const [defaultQuery] = (0, react_1.useState)((0, react_query_1.hashQueryKey)([query]));
    const queryHasChanged = defaultQuery !== (0, react_query_1.hashQueryKey)([query]);
    const onFilter = (0, fuselage_hooks_1.useMutableCallback)((params) => {
        setParams(params);
        setCurrent(0);
    });
    const renderRow = (0, react_1.useCallback)((room) => {
        const { _id, fname, servedBy, ts, lm, department, open, onHold, priorityWeight } = room;
        const getStatusText = (open, onHold, servedBy) => {
            if (!open)
                return t('Closed');
            if (open && !servedBy)
                return t('Queued');
            return onHold ? t('On_Hold_Chats') : t('Room_Status_Open');
        };
        return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onClick: () => onRowClick(_id), action: true, "data-qa-id": fname, children: [isPriorityEnabled && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, "data-qa": 'current-chats-cell-priority', children: (0, jsx_runtime_1.jsx)(PriorityIcon_1.PriorityIcon, { level: priorityWeight }) })), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, "data-qa": 'current-chats-cell-name', children: fname }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, "data-qa": 'current-chats-cell-department', children: department ? department.name : '' }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, "data-qa": 'current-chats-cell-servedBy', children: servedBy === null || servedBy === void 0 ? void 0 : servedBy.username }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, "data-qa": 'current-chats-cell-startedAt', children: (0, moment_1.default)(ts).format('L LTS') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, "data-qa": 'current-chats-cell-lastMessage', children: (0, moment_1.default)(lm).format('L LTS') }), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableCell, { withTruncatedText: true, "data-qa": 'current-chats-cell-status', children: [(0, jsx_runtime_1.jsx)(RoomActivityIcon_1.RoomActivityIcon, { room: room }), " ", getStatusText(open, onHold, !!(servedBy === null || servedBy === void 0 ? void 0 : servedBy.username))] }), canRemoveClosedChats && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { maxHeight: 'x36', fontScale: 'p2', color: 'hint', withTruncatedText: true, "data-qa": 'current-chats-cell-delete', children: !open && (0, jsx_runtime_1.jsx)(RemoveChatButton_1.default, { _id: _id }) }))] }, _id));
    }, [canRemoveClosedChats, onRowClick, isPriorityEnabled, t]);
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isPriorityEnabled && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'priorityWeight', onClick: setSort, sort: 'priorityWeight', w: 'x100', alignItems: 'center', children: t('Priority') }, 'priorityWeight')), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'fname', onClick: setSort, sort: 'fname', "data-qa": 'current-chats-header-name', children: t('Name') }, 'fname'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'departmentId', onClick: setSort, sort: 'departmentId', "data-qa": 'current-chats-header-department', children: t('Department') }, 'departmentId'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'servedBy', onClick: setSort, sort: 'servedBy', "data-qa": 'current-chats-header-servedBy', children: t('Served_By') }, 'servedBy'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'ts', onClick: setSort, sort: 'ts', "data-qa": 'current-chats-header-startedAt', children: t('Started_At') }, 'ts'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'lm', onClick: setSort, sort: 'lm', "data-qa": 'current-chats-header-lastMessage', children: t('Last_Message') }, 'lm'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'open', onClick: setSort, sort: 'open', w: 'x100', "data-qa": 'current-chats-header-status', children: t('Status') }, 'open'), canRemoveClosedChats && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x60', "data-qa": 'current-chats-header-remove', children: t('Remove') }, 'remove'))] }));
    // TODO: Missing error state
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Current_Chats') }), (0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', title: t('This_page_will_be_deprecated_soon'), children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Manage_conversations_in_the_contact_center', children: ["Manage conversations in the", (0, jsx_runtime_1.jsx)("a", { href: directoryPath, children: "contact center" }), "."] }) }), ((isSuccess && (data === null || data === void 0 ? void 0 : data.rooms.length) > 0) || queryHasChanged) && ((0, jsx_runtime_1.jsx)(FilterByText_1.default, { setFilter: onFilter, setCustomFields: setCustomFields, customFields: customFields, hasCustomFields: hasCustomFields })), isWorkspaceOverMacLimit && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', icon: 'warning', title: t('The_workspace_has_exceeded_the_monthly_limit_of_active_contacts'), style: { marginBlock: '2rem' }, children: t('Talk_to_your_workspace_admin_to_address_this_issue') })), isSuccess && (data === null || data === void 0 ? void 0 : data.rooms.length) === 0 && queryHasChanged && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && (data === null || data === void 0 ? void 0 : data.rooms.length) === 0 && !queryHasChanged && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'discussion', title: t('No_chats_yet'), description: t('No_chats_yet_description'), linkHref: 'https://go.rocket.chat/i/omnichannel-docs', linkText: t('Learn_more_about_current_chats') })), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 6 }) })] })), isSuccess && (data === null || data === void 0 ? void 0 : data.rooms.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { "data-qa": 'GenericTableCurrentChatsBody', children: data.rooms.map((room) => renderRow(Object.assign({}, room))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: data.total, onSetItemsPerPage: setItemsPerPage, onSetCurrent: setCurrent }, paginationProps))] }))] })] }), id === 'custom-fields' && hasCustomFields && ((0, jsx_runtime_1.jsx)(CustomFieldsList_1.default, { setCustomFields: setCustomFields, allCustomFields: (allCustomFields === null || allCustomFields === void 0 ? void 0 : allCustomFields.customFields) || [] }))] }));
};
exports.default = (0, react_1.memo)(CurrentChatsPage);
