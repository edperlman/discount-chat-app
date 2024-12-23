"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrioritiesTable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const PriorityIcon_1 = require("./PriorityIcon");
const GenericNoResults_1 = __importDefault(require("../../components/GenericNoResults"));
const GenericTable_1 = require("../../components/GenericTable");
const PrioritiesTable = ({ priorities, onRowClick, isLoading }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { w: '100px', children: t('Icon') }, 'icon'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Name') }, 'name')] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: 2 }) })] })), (priorities === null || priorities === void 0 ? void 0 : priorities.length) === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), priorities && (priorities === null || priorities === void 0 ? void 0 : priorities.length) > 0 && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: priorities === null || priorities === void 0 ? void 0 : priorities.map(({ _id, name, i18n, sortItem, dirty }) => ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, role: 'link', onClick: () => onRowClick(_id), action: true, "qa-row-id": _id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(PriorityIcon_1.PriorityIcon, { level: sortItem }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: dirty ? name : i18n })] }, _id))) })] }))] }));
};
exports.PrioritiesTable = PrioritiesTable;
