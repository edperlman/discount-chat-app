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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AgentOverview_1 = __importDefault(require("./AgentOverview"));
const DateRangePicker_1 = __importDefault(require("./DateRangePicker"));
const InterchangeableChart_1 = __importDefault(require("./InterchangeableChart"));
const Overview_1 = __importDefault(require("./Overview"));
const AutoCompleteDepartment_1 = __importDefault(require("../../../components/AutoCompleteDepartment"));
const Page_1 = require("../../../components/Page");
const useOptions = (type) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, react_1.useMemo)(() => {
        if (type === 'Conversations') {
            return [
                ['Total_conversations', t('Total_conversations')],
                ['Avg_chat_duration', t('Avg_chat_duration')],
                ['Total_messages', t('Total_messages')],
            ];
        }
        return [
            ['Avg_first_response_time', t('Avg_first_response_time')],
            ['Best_first_response_time', t('Best_first_response_time')],
            ['Avg_response_time', t('Avg_response_time')],
            ['Avg_reaction_time', t('Avg_reaction_time')],
        ];
    }, [t, type]);
};
const AnalyticsPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [type, setType] = (0, react_1.useState)('Conversations');
    const [department, setDepartment] = (0, react_1.useState)(null);
    const [dateRange, setDateRange] = (0, react_1.useState)({ start: '', end: '' });
    const [chartName, setChartName] = (0, react_1.useState)();
    const typeOptions = (0, react_1.useMemo)(() => [
        ['Conversations', t('Conversations')],
        ['Productivity', t('Productivity')],
    ], [t]);
    const graphOptions = useOptions(type);
    (0, react_1.useEffect)(() => {
        setChartName(graphOptions[0][0]);
    }, [graphOptions]);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Analytics') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { display: 'flex', flexDirection: 'column', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 4, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mi: 'neg-x4', flexWrap: 'wrap', flexGrow: 1, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexWrap: 'wrap', flexGrow: 1, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mi: 4, flexDirection: 'column', flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Label, { mb: 4, children: t('Type') }), (0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: typeOptions, value: type, onChange: (value) => setType(String(value)) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', mi: 4, flexDirection: 'column', flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Label, { mb: 4, children: t('Departments') }), (0, jsx_runtime_1.jsx)(AutoCompleteDepartment_1.default, { value: department || undefined, onChange: setDepartment, onlyMyDepartments: true, withTitle: false, renderItem: (_a) => {
                                                        var { label } = _a, props = __rest(_a, ["label"]);
                                                        return (0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, props, { label: (0, jsx_runtime_1.jsx)("span", { style: { whiteSpace: 'normal' }, children: label }) }));
                                                    } })] })] }), (0, jsx_runtime_1.jsx)(DateRangePicker_1.default, { flexGrow: 1, mi: 4, onChange: setDateRange })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(Overview_1.default, { type: type, dateRange: dateRange, departmentId: department || '' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 2, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Chart') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: graphOptions, value: chartName, onChange: (value) => setChartName(String(value)) }) })] }) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexGrow: 1, flexShrink: 1, children: [(0, jsx_runtime_1.jsx)(InterchangeableChart_1.default, { flexShrink: 1, w: '66%', h: '100%', chartName: chartName || '', departmentId: department || '', dateRange: dateRange, alignSelf: 'stretch' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', w: '33%', justifyContent: 'stretch', p: 10, mis: 4, children: (0, jsx_runtime_1.jsx)(AgentOverview_1.default, { type: chartName || '', dateRange: dateRange, departmentId: department || '' }) })] })] }) })] }));
};
exports.default = AnalyticsPage;
