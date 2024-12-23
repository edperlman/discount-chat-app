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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AutoCompleteDepartment_1 = __importDefault(require("../../../components/AutoCompleteDepartment"));
const Page_1 = require("../../../components/Page");
const getDateRange_1 = require("../../../lib/utils/getDateRange");
const Label_1 = __importDefault(require("../components/Label"));
const AgentStatusChart_1 = __importDefault(require("./charts/AgentStatusChart"));
const ChatDurationChart_1 = __importDefault(require("./charts/ChatDurationChart"));
const ChatsChart_1 = __importDefault(require("./charts/ChatsChart"));
const ChatsPerAgentChart_1 = __importDefault(require("./charts/ChatsPerAgentChart"));
const ChatsPerDepartmentChart_1 = __importDefault(require("./charts/ChatsPerDepartmentChart"));
const ResponseTimesChart_1 = __importDefault(require("./charts/ResponseTimesChart"));
const AgentsOverview_1 = __importDefault(require("./overviews/AgentsOverview"));
const ChatsOverview_1 = __importDefault(require("./overviews/ChatsOverview"));
const ConversationOverview_1 = __importDefault(require("./overviews/ConversationOverview"));
const ProductivityOverview_1 = __importDefault(require("./overviews/ProductivityOverview"));
const randomizeKeys = (keys) => {
    keys.current = keys.current.map((_key, i) => {
        return `${i}_${new Date().getTime()}`;
    });
};
const dateRange = (0, getDateRange_1.getDateRange)();
const RealTimeMonitoringPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const keys = (0, react_1.useRef)([...Array(10).keys()]);
    const [reloadFrequency, setReloadFrequency] = (0, react_1.useState)(5);
    const [departmentId, setDepartment] = (0, react_1.useState)('');
    const reloadRef = (0, react_1.useRef)({});
    const departmentParams = (0, react_1.useMemo)(() => (Object.assign({}, (departmentId && { departmentId }))), [departmentId]);
    const allParams = (0, react_1.useMemo)(() => (Object.assign(Object.assign({}, departmentParams), dateRange)), [departmentParams]);
    (0, react_1.useEffect)(() => {
        randomizeKeys(keys);
    }, [allParams]);
    const reloadCharts = (0, fuselage_hooks_1.useMutableCallback)(() => {
        Object.values(reloadRef.current).forEach((reload) => {
            reload();
        });
    });
    (0, react_1.useEffect)(() => {
        const interval = setInterval(reloadCharts, reloadFrequency * 1000);
        return () => {
            clearInterval(interval);
            randomizeKeys(keys);
        };
    }, [reloadCharts, reloadFrequency]);
    const reloadOptions = (0, react_1.useMemo)(() => [
        [5, (0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: ["5 ", t('seconds')] }, '5 seconds')],
        [10, (0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: ["10 ", t('seconds')] }, '10 seconds')],
        [30, (0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: ["30 ", t('seconds')] }, '30 seconds')],
        [60, (0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: ["1 ", t('minute')] }, '1 minute')],
    ], [t]);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Real_Time_Monitoring') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 'x4', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignSelf: 'center', w: 'full', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { maxWidth: '50%', display: 'flex', mi: 4, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Label_1.default, { mb: 4, children: t('Departments') }), (0, jsx_runtime_1.jsx)(AutoCompleteDepartment_1.default, { value: departmentId, onChange: setDepartment, placeholder: t('All'), label: t('All'), onlyMyDepartments: true, withTitle: false, renderItem: (_a) => {
                                                var { label } = _a, props = __rest(_a, ["label"]);
                                                return (0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, props, { label: (0, jsx_runtime_1.jsx)("span", { style: { whiteSpace: 'normal' }, children: label }) }));
                                            } })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { maxWidth: '50%', display: 'flex', mi: 4, flexGrow: 1, flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Label_1.default, { mb: 4, children: t('Update_every') }), (0, jsx_runtime_1.jsx)(fuselage_1.Select, { options: reloadOptions, onChange: (0, fuselage_hooks_1.useMutableCallback)((val) => setReloadFrequency(val)), value: reloadFrequency })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', w: 'full', alignItems: 'stretch', flexShrink: 1, children: (0, jsx_runtime_1.jsx)(ConversationOverview_1.default, { flexGrow: 1, flexShrink: 1, width: '50%', reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[0]) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', w: 'full', alignItems: 'stretch', flexShrink: 1, children: [(0, jsx_runtime_1.jsx)(ChatsChart_1.default, { flexGrow: 1, flexShrink: 1, width: '50%', mie: 2, reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[1]), (0, jsx_runtime_1.jsx)(ChatsPerAgentChart_1.default, { flexGrow: 1, flexShrink: 1, width: '50%', mis: 2, reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[2])] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', w: 'full', alignItems: 'stretch', flexShrink: 1, children: (0, jsx_runtime_1.jsx)(ChatsOverview_1.default, { flexGrow: 1, flexShrink: 1, width: '50%', reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[3]) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', w: 'full', alignItems: 'stretch', flexShrink: 1, children: [(0, jsx_runtime_1.jsx)(AgentStatusChart_1.default, { flexGrow: 1, flexShrink: 1, width: '50%', mie: 2, reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[4]), (0, jsx_runtime_1.jsx)(ChatsPerDepartmentChart_1.default, { flexGrow: 1, flexShrink: 1, width: '50%', mis: 2, reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[5])] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', w: 'full', alignItems: 'stretch', flexShrink: 1, children: (0, jsx_runtime_1.jsx)(AgentsOverview_1.default, { flexGrow: 1, flexShrink: 1, reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[6]) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', w: 'full', flexShrink: 1, children: (0, jsx_runtime_1.jsx)(ChatDurationChart_1.default, { flexGrow: 1, flexShrink: 1, w: '100%', reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[7]) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', w: 'full', alignItems: 'stretch', flexShrink: 1, children: (0, jsx_runtime_1.jsx)(ProductivityOverview_1.default, { flexGrow: 1, flexShrink: 1, reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[8]) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', w: 'full', flexShrink: 1, children: (0, jsx_runtime_1.jsx)(ResponseTimesChart_1.default, { flexGrow: 1, flexShrink: 1, w: '100%', reloadRef: reloadRef, params: allParams }, keys === null || keys === void 0 ? void 0 : keys.current[9]) })] }) })] }));
};
exports.default = RealTimeMonitoringPage;
