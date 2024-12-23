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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CounterItem_1 = __importDefault(require("../realTimeMonitoring/counter/CounterItem"));
const CounterRow_1 = __importDefault(require("../realTimeMonitoring/counter/CounterRow"));
const initialData = Array.from({ length: 3 }).map(() => ({ title: undefined, value: '' }));
const conversationsInitialData = [initialData, initialData];
const productivityInitialData = [initialData];
const Overview = ({ type, dateRange, departmentId }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { start, end } = dateRange;
    const params = (0, react_1.useMemo)(() => (Object.assign({ name: type, from: start, to: end }, (departmentId && { departmentId }))), [departmentId, end, start, type]);
    const loadData = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/analytics/overview');
    const [displayData, setDisplayData] = (0, react_1.useState)(conversationsInitialData);
    (0, react_1.useEffect)(() => {
        setDisplayData(type === 'Conversations' ? conversationsInitialData : productivityInitialData);
    }, [type]);
    (0, react_1.useEffect)(() => {
        function fetchData() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!start || !end) {
                    return;
                }
                const value = yield loadData(params);
                if (!value) {
                    return;
                }
                if (value.length > 3) {
                    return setDisplayData([value.slice(0, 3), value.slice(3)]);
                }
                setDisplayData([value]);
            });
        }
        fetchData();
    }, [start, end, loadData, params]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pb: 28, flexDirection: 'column', children: displayData.map((items = [], i) => ((0, jsx_runtime_1.jsx)(CounterRow_1.default, { border: '0', pb: 'none', children: items.map(({ title, value }, i) => ((0, jsx_runtime_1.jsx)(CounterItem_1.default, { flexShrink: 1, pb: 8, flexBasis: '100%', title: title ? t(title) : (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'x60' }), count: value }, i))) }, i))) }));
};
exports.default = Overview;
