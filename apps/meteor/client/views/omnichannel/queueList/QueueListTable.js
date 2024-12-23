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
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const QueueListFilter_1 = require("./QueueListFilter");
const GenericNoResults_1 = __importDefault(require("../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../components/GenericTable");
const usePagination_1 = require("../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../components/GenericTable/hooks/useSort");
const QueueListTable = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('servedBy');
    const [filters, setFilters] = (0, react_1.useState)({
        servedBy: '',
        status: '',
        departmentId: '',
    });
    const mediaQuery = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [mediaQuery && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'servedBy', onClick: setSort, sort: 'servedBy', children: t('Served_By') }, 'servedBy')), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'department', onClick: setSort, sort: 'department', children: t('Department') }, 'department'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'total', onClick: setSort, sort: 'total', children: t('Total') }, 'total'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'status', onClick: setSort, sort: 'status', children: t('Status') }, 'status')] }));
    const query = (0, react_1.useMemo)(() => {
        const query = Object.assign(Object.assign({ sort: `{ "${sortBy}": ${sortDirection === 'asc' ? 1 : -1} }` }, (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }));
        if (filters.status !== 'online') {
            query.includeOfflineAgents = 'true';
        }
        if (filters.servedBy) {
            query.agentId = filters.servedBy;
        }
        if (filters.departmentId) {
            query.departmentId = filters.departmentId;
        }
        return query;
    }, [sortBy, sortDirection, itemsPerPage, current, filters.status, filters.departmentId, filters.servedBy]);
    const getUserStatus = (status) => {
        if (!status) {
            return t('Offline');
        }
        switch (status) {
            case core_typings_1.UserStatus.ONLINE:
                return t('Online');
            case core_typings_1.UserStatus.AWAY:
                return t('Away');
            case core_typings_1.UserStatus.BUSY:
                return t('Busy');
            case core_typings_1.UserStatus.OFFLINE:
                return t('Offline');
            default:
                return status;
        }
    };
    const getLivechatQueue = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/queue');
    const { data, isSuccess, isLoading } = (0, react_query_1.useQuery)(['livechat-queue', query], () => __awaiter(void 0, void 0, void 0, function* () { return getLivechatQueue(query); }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(QueueListFilter_1.QueueListFilter, { setFilter: setFilters }), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingRow, { cols: 4 }) })] })), isSuccess && (data === null || data === void 0 ? void 0 : data.queue.length) === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && (data === null || data === void 0 ? void 0 : data.queue.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data === null || data === void 0 ? void 0 : data.queue.map(({ user, department, chats }) => ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', mb: '5px', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: mediaQuery ? 'x28' : 'x40', username: user.username }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', mi: 8, children: user.username })] }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: department ? department.name : '' }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: chats }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: getUserStatus(user === null || user === void 0 ? void 0 : user.status) })] }, user._id))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] }))] }));
};
exports.default = QueueListTable;
