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
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const FilterByText_1 = __importDefault(require("../../../components/FilterByText"));
const GenericNoResults_1 = __importDefault(require("../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../components/GenericTable");
const usePagination_1 = require("../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../components/GenericTable/hooks/useSort");
const CustomEmoji = ({ onClick, reload }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('name');
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => ({
        query: JSON.stringify({ name: { $regex: (0, string_helpers_1.escapeRegExp)(text), $options: 'i' } }),
        sort: `{ "${sortBy}": ${sortDirection === 'asc' ? 1 : -1} }`,
        count: itemsPerPage,
        offset: current,
    }), [text, itemsPerPage, current, sortBy, sortDirection]), 500);
    const headers = (0, react_1.useMemo)(() => [
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'name', onClick: setSort, sort: 'name', w: 'x200', children: t('Name') }, 'name'),
        (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: 'x200', children: t('Aliases') }, 'aliases'),
    ], [setSort, sortDirection, sortBy, t]);
    const getEmojiList = (0, ui_contexts_1.useEndpoint)('GET', '/v1/emoji-custom.all');
    const { data, refetch, isSuccess, isLoading, isError } = (0, react_query_1.useQuery)(['getEmojiList', query], () => getEmojiList(query));
    (0, react_1.useEffect)(() => {
        reload.current = refetch;
    }, [reload, refetch]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(FilterByText_1.default, { value: text, onChange: (event) => setText(event.target.value) }), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 2 }) })] })), isSuccess && data && data.emojis.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: isSuccess &&
                                    (data === null || data === void 0 ? void 0 : data.emojis.map((emojis) => ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onKeyDown: onClick(emojis._id), onClick: onClick(emojis._id), tabIndex: 0, role: 'link', action: true, "qa-emoji-id": emojis._id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { color: 'default', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: emojis.name }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { color: 'default', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: Array.isArray(emojis.aliases) ? emojis.aliases.join(', ') : emojis.aliases }) })] }, emojis._id)))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] })), isSuccess && data && data.emojis.length === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => refetch(), children: t('Reload_page') }) })] }))] }));
};
exports.default = CustomEmoji;
