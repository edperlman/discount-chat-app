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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const chartHandler_1 = require("../../../../app/livechat/client/lib/chartHandler");
const secondsToHHMMSS_1 = require("../../../../lib/utils/secondsToHHMMSS");
const Chart_1 = __importDefault(require("../realTimeMonitoring/charts/Chart"));
const getChartTooltips = (chartName) => {
    switch (chartName) {
        case 'Avg_chat_duration':
        case 'Avg_first_response_time':
        case 'Best_first_response_time':
        case 'Avg_response_time':
        case 'Avg_reaction_time':
            return {
                callbacks: {
                    title([ctx]) {
                        const { dataset } = ctx;
                        return dataset.label;
                    },
                    label(ctx) {
                        const { dataset, dataIndex } = ctx;
                        const item = dataset.data[dataIndex];
                        return (0, secondsToHHMMSS_1.secondsToHHMMSS)(typeof item === 'number' ? item : 0);
                    },
                },
            };
        default:
            return {};
    }
};
const InterchangeableChart = (_a) => {
    var { departmentId, dateRange, chartName } = _a, props = __rest(_a, ["departmentId", "dateRange", "chartName"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const canvas = (0, react_1.useRef)(null);
    const context = (0, react_1.useRef)();
    const { start, end } = dateRange;
    const loadData = (0, ui_contexts_1.useMethod)('livechat:getAnalyticsChartData');
    const draw = (0, fuselage_hooks_1.useMutableCallback)((params) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const tooltipCallbacks = getChartTooltips(chartName);
            if (!((_a = params === null || params === void 0 ? void 0 : params.daterange) === null || _a === void 0 ? void 0 : _a.from) || !((_b = params === null || params === void 0 ? void 0 : params.daterange) === null || _b === void 0 ? void 0 : _b.to)) {
                return;
            }
            const result = yield loadData(params);
            if (!(result === null || result === void 0 ? void 0 : result.chartLabel) || !(result === null || result === void 0 ? void 0 : result.dataLabels) || !(result === null || result === void 0 ? void 0 : result.dataPoints)) {
                throw new Error('Error! fetching chart data. Details: livechat:getAnalyticsChartData => Missing Data');
            }
            (context.current || typeof context.current === 'undefined') &&
                canvas.current &&
                (context.current = yield (0, chartHandler_1.drawLineChart)(canvas.current, context.current, [result.chartLabel], result.dataLabels, [result.dataPoints], {
                    tooltipCallbacks,
                }));
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    (0, react_1.useEffect)(() => {
        draw(Object.assign({ daterange: {
                from: start,
                to: end,
            }, chartOptions: { name: chartName } }, (departmentId && { departmentId })));
    }, [chartName, departmentId, draw, end, start, t, loadData]);
    return (0, jsx_runtime_1.jsx)(Chart_1.default, Object.assign({ canvasRef: canvas }, props));
};
exports.default = InterchangeableChart;
