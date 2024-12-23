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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const BusinessHoursRow_1 = __importDefault(require("./BusinessHoursRow"));
const FilterByText_1 = __importDefault(require("../../components/FilterByText"));
const GenericNoResults_1 = __importDefault(require("../../components/GenericNoResults"));
const GenericTable_1 = require("../../components/GenericTable");
const usePagination_1 = require("../../components/GenericTable/hooks/usePagination");
const BusinessHoursTable = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const _a = (0, usePagination_1.usePagination)(), { current, itemsPerPage, setItemsPerPage: onSetItemsPerPage, setCurrent: onSetCurrent } = _a, paginationProps = __rest(_a, ["current", "itemsPerPage", "setItemsPerPage", "setCurrent"]);
    const query = (0, fuselage_hooks_1.useDebouncedValue)((0, react_1.useMemo)(() => (Object.assign(Object.assign({ name: text }, (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }))), [text, itemsPerPage, current]), 500);
    const getBusinessHours = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/business-hours');
    const { data, isLoading, isSuccess, isError, refetch } = (0, react_query_1.useQuery)(['livechat-getBusinessHours', query], () => __awaiter(void 0, void 0, void 0, function* () { return getBusinessHours(query); }));
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Name') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Timezone') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Open_Days') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { width: 'x100', children: t('Enabled') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { width: 'x100', children: t('Remove') })] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(FilterByText_1.default, { value: text, onChange: (event) => setText(event.target.value) }), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingRow, { cols: 5 }) })] })), isSuccess && (data === null || data === void 0 ? void 0 : data.businessHours.length) === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && (data === null || data === void 0 ? void 0 : data.businessHours.length) > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data === null || data === void 0 ? void 0 : data.businessHours.map((businessHour) => (0, jsx_runtime_1.jsx)(BusinessHoursRow_1.default, Object.assign({}, businessHour), businessHour._id)) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: data.total || 0, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }, paginationProps))] })), isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => refetch(), children: t('Reload_page') }) })] }))] }));
};
exports.default = BusinessHoursTable;
