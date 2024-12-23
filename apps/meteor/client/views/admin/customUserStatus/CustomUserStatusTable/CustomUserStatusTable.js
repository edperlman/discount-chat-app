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
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CustomUserStatusRow_1 = __importDefault(require("./CustomUserStatusRow"));
const FilterByText_1 = __importDefault(require("../../../../components/FilterByText"));
const GenericNoResults_1 = __importDefault(require("../../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../../components/GenericTable");
const usePagination_1 = require("../../../../components/GenericTable/hooks/usePagination");
const useSort_1 = require("../../../../components/GenericTable/hooks/useSort");
// TODO: Missing error state
const CustomUserStatus = ({ reload, onClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('name');
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => ({
        name: (0, string_helpers_1.escapeRegExp)(text),
        sort: `{ "${sortBy}": ${sortDirection === 'asc' ? 1 : -1} }`,
        count: itemsPerPage,
        offset: current,
    }), [text, itemsPerPage, current, sortBy, sortDirection]), 500);
    const getCustomUserStatus = (0, ui_contexts_1.useEndpoint)('GET', '/v1/custom-user-status.list');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { data, isLoading, refetch, isFetched } = (0, react_query_1.useQuery)(['custom-user-statuses', query], () => __awaiter(void 0, void 0, void 0, function* () {
        const { statuses } = yield getCustomUserStatus(query);
        return statuses;
    }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    (0, react_1.useEffect)(() => {
        reload.current = refetch;
    }, [reload, refetch]);
    if (!data) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(FilterByText_1.default, { value: text, onChange: (event) => setText(event.target.value) }), data.length === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), data && data.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableHeader, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'name', onClick: setSort, sort: 'name', children: t('Name') }, 'name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { direction: sortDirection, active: sortBy === 'statusType', onClick: setSort, sort: 'statusType', children: t('Presence') }, 'presence')] }), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableBody, { children: [isLoading && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 2 }), data === null || data === void 0 ? void 0 : data.map((status) => (0, jsx_runtime_1.jsx)(CustomUserStatusRow_1.default, { status: status, onClick: onClick }, status._id))] })] }), isFetched && ((0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ current: current, itemsPerPage: itemsPerPage, count: data.length, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps)))] }))] }));
};
exports.default = CustomUserStatus;
