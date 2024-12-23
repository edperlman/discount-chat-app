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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const AuditLogEntry_1 = __importDefault(require("./AuditLogEntry"));
const GenericNoResults_1 = __importDefault(require("../../../components/GenericNoResults"));
const GenericTable_1 = require("../../../components/GenericTable");
const dateRange_1 = require("../utils/dateRange");
const DateRangePicker_1 = __importDefault(require("./forms/DateRangePicker"));
const AuditLogTable = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const [dateRange, setDateRange] = (0, react_1.useState)(() => ({
        start: (0, dateRange_1.createStartOfToday)(),
        end: (0, dateRange_1.createEndOfToday)(),
    }));
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getAudits = (0, ui_contexts_1.useMethod)('auditGetAuditions');
    const { data, isLoading, isSuccess } = (0, react_query_1.useQuery)(['audits', dateRange], () => __awaiter(void 0, void 0, void 0, function* () {
        const { start, end } = dateRange;
        return getAudits({ startDate: start !== null && start !== void 0 ? start : new Date(0), endDate: end !== null && end !== void 0 ? end : new Date() });
    }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('User') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Looked_for') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('When') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { width: 80, children: t('Results') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { children: t('Filters_applied') })] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { alignSelf: 'stretch', children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Date') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(DateRangePicker_1.default, { display: 'flex', flexGrow: 1, value: dateRange, onChange: setDateRange }) })] }), isLoading && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingRow, { cols: 4 }) })] })), isSuccess && data.length === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), isSuccess && data.length > 0 && ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: data.map((auditLog) => ((0, jsx_runtime_1.jsx)(AuditLogEntry_1.default, { value: auditLog }, auditLog._id))) })] }))] }));
};
exports.default = AuditLogTable;
