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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Chart_1 = __importDefault(require("./Chart"));
const useUpdateChartData_1 = require("./useUpdateChartData");
const chartHandler_1 = require("../../../../../app/livechat/client/lib/chartHandler");
const useAsyncState_1 = require("../../../../hooks/useAsyncState");
const useEndpointData_1 = require("../../../../hooks/useEndpointData");
const labels = ['Available', 'Away', 'Busy', 'Offline'];
const initialData = {
    available: 0,
    away: 0,
    busy: 0,
    offline: 0,
};
const init = (canvas, context, t) => (0, chartHandler_1.drawDoughnutChart)(canvas, t('Agents'), context, labels.map((l) => t(l)), Object.values(initialData));
const AgentStatusChart = (_a) => {
    var { params, reloadRef } = _a, props = __rest(_a, ["params", "reloadRef"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const canvas = (0, react_1.useRef)(null);
    const context = (0, react_1.useRef)();
    const updateChartData = (0, useUpdateChartData_1.useUpdateChartData)({
        context,
        canvas,
        t,
        init,
    });
    const { value: data, phase: state, reload } = (0, useEndpointData_1.useEndpointData)('/v1/livechat/analytics/dashboards/charts/agents-status', { params });
    reloadRef.current.agentStatusChart = reload;
    const { offline = 0, available = 0, away = 0, busy = 0 } = data !== null && data !== void 0 ? data : initialData;
    (0, react_1.useEffect)(() => {
        const initChart = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!canvas.current) {
                return;
            }
            context.current = yield init(canvas.current, context.current, t);
        });
        initChart();
    }, [t]);
    (0, react_1.useEffect)(() => {
        if (state === useAsyncState_1.AsyncStatePhase.RESOLVED) {
            updateChartData(t('Offline'), [offline]);
            updateChartData(t('Available'), [available]);
            updateChartData(t('Away'), [away]);
            updateChartData(t('Busy'), [busy]);
        }
    }, [available, away, busy, offline, state, t, updateChartData]);
    return (0, jsx_runtime_1.jsx)(Chart_1.default, Object.assign({ canvasRef: canvas }, props));
};
exports.default = AgentStatusChart;