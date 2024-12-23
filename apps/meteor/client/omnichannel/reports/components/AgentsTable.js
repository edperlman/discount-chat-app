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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsTable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericTable_1 = require("../../../components/GenericTable");
exports.AgentsTable = (0, react_1.memo)(({ data, sortBy, sortDirection, setSort }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const onHeaderClick = (0, fuselage_hooks_1.useMutableCallback)((id) => {
        setSort(id, sortDirection === 'asc' ? 'desc' : 'asc');
    });
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableHeader, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { sort: 'name', direction: sortDirection, active: sortBy === 'name', onClick: onHeaderClick, children: t('Agents') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { sort: 'total', direction: sortDirection, active: sortBy === 'total', onClick: onHeaderClick, children: t('Total_conversations') })] }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data.map((item) => ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: item.label }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: item.value })] }, `${item.label}_${item.value}`))) })] }));
});
exports.AgentsTable.displayName = 'AgentsTable';
