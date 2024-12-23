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
const heatmap_1 = require("@nivo/heatmap");
const fuselage_1 = require("@rocket.chat/fuselage");
const colors_json_1 = __importDefault(require("@rocket.chat/fuselage-tokens/colors.json"));
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const DownloadDataButton_1 = __importDefault(require("../../../../components/dashboards/DownloadDataButton"));
const PeriodSelector_1 = __importDefault(require("../../../../components/dashboards/PeriodSelector"));
const usePeriodSelectorState_1 = require("../../../../components/dashboards/usePeriodSelectorState");
const EngagementDashboardCardFilter_1 = __importDefault(require("../EngagementDashboardCardFilter"));
const useUsersByTimeOfTheDay_1 = require("./useUsersByTimeOfTheDay");
const UsersByTimeOfTheDaySection = ({ timezone }) => {
    const [period, periodSelectorProps] = (0, usePeriodSelectorState_1.usePeriodSelectorState)('last 7 days', 'last 30 days', 'last 90 days');
    const utc = timezone === 'utc';
    const { data, isLoading } = (0, useUsersByTimeOfTheDay_1.useUsersByTimeOfTheDay)({ period, utc });
    const { t } = (0, react_i18next_1.useTranslation)();
    const [dates, values] = (0, react_1.useMemo)(() => {
        if (!data || isLoading) {
            return [];
        }
        const length = utc ? (0, moment_1.default)(data.end).diff(data.start, 'days') + 1 : (0, moment_1.default)(data.end).diff(data.start, 'days') - 1;
        const start = utc ? moment_1.default.utc(data.start).endOf('day') : (0, moment_1.default)(data.start).endOf('day').add(1, 'days');
        const dates = new Array(length);
        for (let i = 0; i < length; i++) {
            dates[i] = start.clone().add(i, 'days').toISOString();
        }
        const values = new Array(24);
        for (let hour = 0; hour < 24; hour++) {
            values[hour] = {
                id: hour.toString(),
                data: dates.map((x) => ({ x, y: 0 })),
            };
        }
        const timezoneOffset = (0, moment_1.default)().utcOffset() / 60;
        for (const { users, hour, day, month, year } of data.week) {
            const date = utc ? moment_1.default.utc([year, month - 1, day, hour]) : (0, moment_1.default)([year, month - 1, day, hour]).add(timezoneOffset, 'hours');
            if (utc || (!date.isSame(data.end) && !date.clone().startOf('day').isSame(data.start))) {
                const dataPoint = values[date.hour()].data.find((point) => point.x === date.endOf('day').toISOString());
                if (dataPoint) {
                    dataPoint.y += users;
                }
            }
        }
        return [dates, values];
    }, [data, isLoading, utc]);
    const tooltip = (0, react_1.useCallback)(({ cell }) => {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Tooltip, { children: [(0, moment_1.default)(cell.data.x).format('ddd'), ' ', (0, moment_1.default)()
                    .set({ hour: parseInt(cell.serieId, 10), minute: 0, second: 0 })
                    .format('LT'), (0, jsx_runtime_1.jsx)("br", {}), t('Value_users', { value: cell.data.y })] }));
    }, [t]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(EngagementDashboardCardFilter_1.default, { children: [(0, jsx_runtime_1.jsx)(PeriodSelector_1.default, Object.assign({}, periodSelectorProps)), (0, jsx_runtime_1.jsx)(DownloadDataButton_1.default, { attachmentName: `UsersByTimeOfTheDaySection_start_${data === null || data === void 0 ? void 0 : data.start}_end_${data === null || data === void 0 ? void 0 : data.end}`, headers: ['Date', 'Users'], dataAvailable: !!data, dataExtractor: () => {
                            var _a, _b, _c;
                            return (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.week) === null || _a === void 0 ? void 0 : _a.map(({ users, hour, day, month, year }) => ({
                                date: (0, moment_1.default)([year, month - 1, day, hour, 0, 0, 0]),
                                users,
                            }))) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.date.diff(b.date))) === null || _c === void 0 ? void 0 : _c.map(({ date, users }) => [date.toISOString(), users]);
                        } })] }), !isLoading && values && dates ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', style: { height: 696 }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { align: 'stretch', grow: 1, shrink: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: { position: 'relative' }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                            }, children: (0, jsx_runtime_1.jsx)(heatmap_1.ResponsiveHeatMapCanvas, { data: values, xInnerPadding: 0.1, yInnerPadding: 0.25, margin: {
                                    // TODO: Get it from theme
                                    left: 60,
                                    bottom: 20,
                                }, colors: {
                                    type: 'quantize',
                                    colors: [
                                        // TODO: Get it from theme
                                        colors_json_1.default.b100,
                                        colors_json_1.default.b200,
                                        colors_json_1.default.b300,
                                        colors_json_1.default.b400,
                                        colors_json_1.default.b500,
                                        colors_json_1.default.b600,
                                        colors_json_1.default.b700,
                                    ],
                                }, emptyColor: 'transparent', enableLabels: false, axisTop: null, axisRight: null, axisBottom: {
                                    // TODO: Get it from theme
                                    tickSize: 0,
                                    tickPadding: 8,
                                    tickRotation: 0,
                                    format: (isoString) => ((dates === null || dates === void 0 ? void 0 : dates.length) === 8 ? (0, moment_1.default)(isoString).format('ddd') : ''),
                                }, axisLeft: {
                                    // TODO: Get it from theme
                                    tickSize: 0,
                                    tickPadding: 8,
                                    tickRotation: 0,
                                    format: (hour) => (0, moment_1.default)()
                                        .set({ hour: parseInt(hour, 10), minute: 0, second: 0 })
                                        .format('LT'),
                                }, hoverTarget: 'cell', animate: dates && dates.length <= 7, motionConfig: 'stiff', theme: {
                                    // TODO: Get it from theme
                                    axis: {
                                        ticks: {
                                            text: {
                                                fill: colors_json_1.default.n600,
                                                fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
                                                fontSize: 10,
                                                fontStyle: 'normal',
                                                fontWeight: 600,
                                                letterSpacing: '0.2px',
                                                lineHeight: '12px',
                                            },
                                        },
                                    },
                                    tooltip: {
                                        container: {
                                            backgroundColor: colors_json_1.default.n900,
                                            boxShadow: '0px 0px 12px rgba(47, 52, 61, 0.12), 0px 0px 2px rgba(47, 52, 61, 0.08)',
                                            borderRadius: 2,
                                        },
                                    },
                                }, tooltip: tooltip }) }) }) }) })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 696 }))] }));
};
exports.default = UsersByTimeOfTheDaySection;
