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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const CannedResponseFilter_1 = __importDefault(require("./CannedResponseFilter"));
const useRemoveCannedResponse_1 = require("./useRemoveCannedResponse");
const GenericNoResults_1 = __importDefault(require("../../components/GenericNoResults"));
const GenericTable_1 = require("../../components/GenericTable");
const usePagination_1 = require("../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../components/GenericTable/hooks/useSort");
const useFormatDateAndTime_1 = require("../../hooks/useFormatDateAndTime");
const CannedResponsesTable = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const isMonitor = (0, ui_contexts_1.usePermission)('save-department-canned-responses');
    const isManager = (0, ui_contexts_1.usePermission)('save-all-canned-responses');
    const [createdBy, setCreatedBy] = (0, react_1.useState)('all');
    const [sharing, setSharing] = (0, react_1.useState)('');
    const [text, setText] = (0, react_1.useState)('');
    const debouncedText = (0, fuselage_hooks_1.useDebouncedValue)(text, 500);
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const { sortBy, setSort, sortDirection } = (0, useSort_1.useSort)('shortcut');
    const query = (0, react_1.useMemo)(() => (Object.assign(Object.assign(Object.assign(Object.assign({ text: debouncedText, sort: JSON.stringify({ [sortBy]: sortDirection === 'asc' ? 1 : -1 }) }, (sharing && { scope: sharing })), (createdBy && createdBy !== 'all' && { createdBy })), (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }))), [createdBy, current, debouncedText, itemsPerPage, sharing, sortBy, sortDirection]);
    const [defaultQuery] = (0, react_1.useState)((0, react_query_1.hashQueryKey)([query]));
    const queryHasChanged = defaultQuery !== (0, react_query_1.hashQueryKey)([query]);
    const getCannedResponses = (0, ui_contexts_1.useEndpoint)('GET', '/v1/canned-responses');
    const { data, isLoading, isSuccess } = (0, react_query_1.useQuery)(['getCannedResponses', query], () => getCannedResponses(query), {
        refetchOnWindowFocus: false,
    });
    const handleAddNew = (0, fuselage_hooks_1.useMutableCallback)(() => router.navigate('/omnichannel/canned-responses/new'));
    const onRowClick = (0, fuselage_hooks_1.useMutableCallback)((id, scope) => () => {
        if (scope === 'global' && isMonitor && !isManager) {
            return dispatchToastMessage({
                type: 'error',
                message: t('Not_authorized'),
            });
        }
        router.navigate(`/omnichannel/canned-responses/edit/${id}`);
    });
    const handleDelete = (0, useRemoveCannedResponse_1.useRemoveCannedResponse)();
    const defaultOptions = (0, react_1.useMemo)(() => ({
        global: t('Public'),
        department: t('Department'),
        user: t('Private'),
    }), [t]);
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'shortcut', onClick: setSort, sort: 'shortcut', children: t('Shortcut') }, 'shortcut'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'scope', onClick: setSort, sort: 'scope', children: t('Sharing') }, 'sharing'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'createdBy', onClick: setSort, sort: 'createdBy', children: t('Created_by') }, 'createdBy'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === '_createdAt', onClick: setSort, sort: '_createdAt', children: t('Created_at') }, 'createdAt'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'tags', onClick: setSort, sort: 'tags', children: t('Tags') }, 'tags'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x60', children: t('Remove') }, 'remove')] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [((isSuccess && (data === null || data === void 0 ? void 0 : data.cannedResponses.length) > 0) || queryHasChanged) && ((0, jsx_runtime_1.jsx)(CannedResponseFilter_1.default, { createdBy: createdBy, setCreatedBy: setCreatedBy, sharing: sharing, setSharing: setSharing, text: text, setText: setText })), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingRow, { cols: 6 }) })] })), isSuccess && (data === null || data === void 0 ? void 0 : data.cannedResponses.length) === 0 && queryHasChanged && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && (data === null || data === void 0 ? void 0 : data.cannedResponses.length) === 0 && !queryHasChanged && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'baloon-exclamation', title: t('No_Canned_Responses_Yet'), description: t('No_Canned_Responses_Yet-description'), buttonTitle: t('Create_canned_response'), buttonAction: handleAddNew, linkHref: 'https://go.rocket.chat/i/omnichannel-docs', linkText: t('Learn_more_about_canned_responses') })), isSuccess && (data === null || data === void 0 ? void 0 : data.cannedResponses.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { "aria-busy": text !== debouncedText, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data === null || data === void 0 ? void 0 : data.cannedResponses.map(({ _id, shortcut, scope, createdBy, _createdAt, tags = [] }) => ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, role: 'link', onClick: onRowClick(_id, scope), action: true, "qa-user-id": _id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: shortcut }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: defaultOptions[scope] }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x24', username: createdBy.username }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', withTruncatedText: true, mi: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignSelf: 'center', withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, color: 'default', children: createdBy.username }) }) })] }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: getTime(_createdAt) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: tags.join(', ') }), !(scope === 'global' && isMonitor && !isManager) && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'trash', small: true, title: t('Remove'), onClick: (e) => {
                                                    e.stopPropagation();
                                                    handleDelete(_id);
                                                } }) }))] }, _id))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] }))] }));
};
exports.default = CannedResponsesTable;
