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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const bar_1 = require("@nivo/bar");
const fuselage_1 = require("@rocket.chat/fuselage");
const colors_json_1 = __importDefault(require("@rocket.chat/fuselage-tokens/colors.json"));
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const DownloadDataButton_1 = __importDefault(require("../../../../components/dashboards/DownloadDataButton"));
const PeriodSelector_1 = __importDefault(require("../../../../components/dashboards/PeriodSelector"));
const usePeriodLabel_1 = require("../../../../components/dashboards/usePeriodLabel");
const usePeriodSelectorState_1 = require("../../../../components/dashboards/usePeriodSelectorState");
const CounterSet_1 = __importDefault(require("../../../../components/dataView/CounterSet"));
const EngagementDashboardCardFilter_1 = __importDefault(require("../EngagementDashboardCardFilter"));
const useMessagesSent_1 = require("./useMessagesSent");
const MessagesSentSection = () => {
    const [period, periodSelectorProps] = (0, usePeriodSelectorState_1.usePeriodSelectorState)('last 7 days', 'last 30 days', 'last 90 days');
    const periodLabel = (0, usePeriodLabel_1.usePeriodLabel)(period);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data } = (0, useMessagesSent_1.useMessagesSent)({ period });
    const [countFromPeriod, variatonFromPeriod, countFromYesterday, variationFromYesterday, values] = (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d, _e;
        if (!data) {
            return [];
        }
        const values = Array.from({ length: (0, moment_1.default)(data.end).diff(data.start, 'days') + 1 }, (_, i) => ({
            date: (0, moment_1.default)(data.start).add(i, 'days').toISOString(),
            newMessages: 0,
        }));
        for (const { day, messages } of (_a = data.days) !== null && _a !== void 0 ? _a : []) {
            const i = (0, moment_1.default)(day).diff(data.start, 'days');
            if (i >= 0) {
                values[i].newMessages += messages;
            }
        }
        return [(_b = data.period) === null || _b === void 0 ? void 0 : _b.count, (_c = data.period) === null || _c === void 0 ? void 0 : _c.variation, (_d = data.yesterday) === null || _d === void 0 ? void 0 : _d.count, (_e = data.yesterday) === null || _e === void 0 ? void 0 : _e.variation, values];
    }, [data]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(EngagementDashboardCardFilter_1.default, { children: [(0, jsx_runtime_1.jsx)(PeriodSelector_1.default, Object.assign({}, periodSelectorProps)), (0, jsx_runtime_1.jsx)(DownloadDataButton_1.default, { attachmentName: `MessagesSentSection_start_${data === null || data === void 0 ? void 0 : data.start}_end_${data === null || data === void 0 ? void 0 : data.end}`, headers: ['Date', 'Messages'], dataAvailable: !!data, dataExtractor: () => values === null || values === void 0 ? void 0 : values.map(({ date, newMessages }) => [date, newMessages]) })] }), (0, jsx_runtime_1.jsx)(CounterSet_1.default, { counters: [
                    {
                        count: countFromPeriod !== null && countFromPeriod !== void 0 ? countFromPeriod : (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: '3ex', height: '1em' }),
                        variation: variatonFromPeriod !== null && variatonFromPeriod !== void 0 ? variatonFromPeriod : 0,
                        description: periodLabel,
                    },
                    {
                        count: countFromYesterday !== null && countFromYesterday !== void 0 ? countFromYesterday : (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: '3ex', height: '1em' }),
                        variation: variationFromYesterday !== null && variationFromYesterday !== void 0 ? variationFromYesterday : 0,
                        description: t('Yesterday'),
                    },
                ] }), (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { children: values ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: { height: 240 }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { align: 'stretch', grow: 1, shrink: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: { position: 'relative' }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                }, children: (0, jsx_runtime_1.jsx)(bar_1.ResponsiveBar, { data: values, indexBy: 'date', keys: ['newMessages'], groupMode: 'grouped', padding: 0.25, margin: {
                                        // TODO: Get it from theme
                                        bottom: 20,
                                    }, colors: [
                                        // TODO: Get it from theme
                                        fuselage_1.Palette.statusColor['status-font-on-info'].toString(),
                                    ], enableLabel: false, enableGridY: false, axisTop: null, axisRight: null, axisBottom: (values.length === 7 && {
                                        tickSize: 0,
                                        // TODO: Get it from theme
                                        tickPadding: 4,
                                        tickRotation: 0,
                                        format: (date) => (0, moment_1.default)(date).format('dddd'),
                                    }) ||
                                        null, axisLeft: null, animate: true, motionConfig: 'stiff', theme: {
                                        // TODO: Get it from theme
                                        axis: {
                                            ticks: {
                                                text: {
                                                    fill: colors_json_1.default.n600,
                                                    fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
                                                    fontSize: '10px',
                                                    fontStyle: 'normal',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.2px',
                                                    lineHeight: '12px',
                                                },
                                            },
                                        },
                                    }, tooltip: ({ value }) => (0, jsx_runtime_1.jsx)(fuselage_1.Tooltip, { children: t('Value_messages', { value }) }) }) }) }) }) })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 240 })) })] }));
};
exports.default = MessagesSentSection;
