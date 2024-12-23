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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const AddManager_1 = __importDefault(require("./AddManager"));
const RemoveManagerButton_1 = __importDefault(require("./RemoveManagerButton"));
const FilterByText_1 = __importDefault(require("../../../components/FilterByText"));
const GenericNoResults_1 = __importDefault(require("../../../components/GenericNoResults/GenericNoResults"));
const GenericTable_1 = require("../../../components/GenericTable");
const usePagination_1 = require("../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../components/GenericTable/hooks/useSort");
// TODO: Missing error state
const ManagersTable = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('name');
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => ({
        text,
        sort: `{ "${sortBy}": ${sortDirection === 'asc' ? 1 : -1} }`,
        count: itemsPerPage,
        offset: current,
    }), [text, sortBy, sortDirection, itemsPerPage, current]), 500);
    const getManagers = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/users/manager');
    const { data, isLoading, isSuccess, refetch } = (0, react_query_1.useQuery)(['omnichannel', 'managers', 'livechat-manager', query], () => __awaiter(void 0, void 0, void 0, function* () { return getManagers(query); }));
    const [defaultQuery] = (0, react_1.useState)((0, react_query_1.hashQueryKey)([query]));
    const queryHasChanged = defaultQuery !== (0, react_query_1.hashQueryKey)([query]);
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'name', onClick: setSort, sort: 'name', children: t('Name') }, 'name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'username', onClick: setSort, sort: 'username', children: t('Username') }, 'username'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'emails.address', onClick: setSort, sort: 'emails.address', children: t('Email') }, 'email'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x60', children: t('Remove') }, 'remove')] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AddManager_1.default, { reload: refetch }), ((isSuccess && (data === null || data === void 0 ? void 0 : data.users.length) > 0) || queryHasChanged) && ((0, jsx_runtime_1.jsx)(FilterByText_1.default, { value: text, onChange: (event) => setText(event.target.value) })), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { "aria-busy": true, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 2 }) })] })), isSuccess && data.users.length === 0 && ((0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { icon: 'shield', title: t('No_managers_yet'), description: t('No_managers_yet_description'), linkHref: 'https://go.rocket.chat/i/omnichannel-docs', linkText: t('Learn_more_about_managers') })), isSuccess && data.users.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { "aria-busy": isLoading, "aria-label": t('Managers'), children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data.users.map((user) => {
                                    var _a;
                                    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, "qa-user-id": user._id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x28', username: user.username || '', etag: user.avatarETag }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', withTruncatedText: true, mi: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignSelf: 'center', withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, color: 'default', children: user.name || user.username }) }) })] }) }), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableCell, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, color: 'hint', children: user.username }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4 })] }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: ((_a = user.emails) === null || _a === void 0 ? void 0 : _a.length) && user.emails[0].address }), (0, jsx_runtime_1.jsx)(RemoveManagerButton_1.default, { _id: user._id, reload: refetch })] }, user._id));
                                }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: data.total || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] }))] }));
};
exports.default = ManagersTable;
