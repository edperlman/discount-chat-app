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
exports.QueueListFilter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AutoCompleteAgent_1 = __importDefault(require("../../../components/AutoCompleteAgent"));
const AutoCompleteDepartment_1 = __importDefault(require("../../../components/AutoCompleteDepartment"));
const QueueListFilter = (_a) => {
    var { setFilter } = _a, props = __rest(_a, ["setFilter"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const statusOptions = [
        ['online', t('Online')],
        ['offline', t('Include_Offline_Agents')],
    ];
    const [servedBy, setServedBy] = (0, fuselage_hooks_1.useLocalStorage)('servedBy', 'all');
    const [status, setStatus] = (0, fuselage_hooks_1.useLocalStorage)('status', 'online');
    const [department, setDepartment] = (0, fuselage_hooks_1.useLocalStorage)('department', 'all');
    const handleServedBy = (0, fuselage_hooks_1.useMutableCallback)((e) => setServedBy(e));
    const handleStatus = (0, fuselage_hooks_1.useMutableCallback)((e) => setStatus(e));
    const handleDepartment = (0, fuselage_hooks_1.useMutableCallback)((e) => setDepartment(e));
    const onSubmit = (0, fuselage_hooks_1.useMutableCallback)((e) => e.preventDefault());
    (0, react_1.useEffect)(() => {
        const filters = { status };
        if (servedBy !== 'all') {
            filters.servedBy = servedBy;
        }
        if (department && department !== 'all') {
            filters.departmentId = department;
        }
        setFilter(filters);
    }, [setFilter, servedBy, status, department]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ mb: 16, is: 'form', onSubmit: onSubmit, display: 'flex', flexDirection: 'column' }, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Label, { mb: 4, children: t('Served_By') }), (0, jsx_runtime_1.jsx)(AutoCompleteAgent_1.default, { haveAll: true, value: servedBy, onChange: handleServedBy })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Label, { mb: 4, children: t('Status') }), (0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: statusOptions, value: status, onChange: handleStatus, placeholder: t('Status') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mie: 8, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Label, { mb: 4, children: t('Department') }), (0, jsx_runtime_1.jsx)(AutoCompleteDepartment_1.default, { haveAll: true, value: department, onChange: handleDepartment, onlyMyDepartments: true })] })] })) })));
};
exports.QueueListFilter = QueueListFilter;
