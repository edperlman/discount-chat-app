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
const line_1 = require("@nivo/line");
const fuselage_1 = require("@rocket.chat/fuselage");
const colors_json_1 = __importDefault(require("@rocket.chat/fuselage-tokens/colors.json"));
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useActiveUsers_1 = require("./useActiveUsers");
const DownloadDataButton_1 = __importDefault(require("../../../../components/dashboards/DownloadDataButton"));
const CounterSet_1 = __importDefault(require("../../../../components/dataView/CounterSet"));
const useFormatDate_1 = require("../../../../hooks/useFormatDate");
const EngagementDashboardCardFilter_1 = __importDefault(require("../EngagementDashboardCardFilter"));
const LegendSymbol_1 = __importDefault(require("../dataView/LegendSymbol"));
const ActiveUsersSection = ({ timezone }) => {
    const utc = timezone === 'utc';
    const { data } = (0, useActiveUsers_1.useActiveUsers)({ utc });
    const [countDailyActiveUsers, diffDailyActiveUsers, countWeeklyActiveUsers, diffWeeklyActiveUsers, countMonthlyActiveUsers, diffMonthlyActiveUsers, dauValues = [], wauValues = [], mauValues = [],] = (0, react_1.useMemo)(() => {
        if (!data) {
            return [];
        }
        const createPoint = (i) => ({
            x: (0, moment_1.default)(data.start).add(i, 'days').startOf('day').toDate(),
            y: 0,
        });
        const createPoints = () => Array.from({ length: (0, moment_1.default)(data.end).diff(data.start, 'days') }, (_, i) => createPoint(i));
        const dauValuesLocal = createPoints();
        const prevDauValue = createPoint(-1);
        const wauValuesLocal = createPoints();
        const prevWauValue = createPoint(-1);
        const mauValuesLocal = createPoints();
        const prevMauValue = createPoint(-1);
        const usersListsMap = data.month.reduce((map, dayData) => {
            const date = utc
                ? moment_1.default.utc({ year: dayData.year, month: dayData.month - 1, day: dayData.day }).endOf('day')
                : (0, moment_1.default)({ year: dayData.year, month: dayData.month - 1, day: dayData.day }).endOf('day');
            const dateOffset = date.diff(data.start, 'days');
            if (dateOffset >= 0 && dauValuesLocal[dateOffset]) {
                map[dateOffset] = dayData.usersList;
                dauValuesLocal[dateOffset].y = dayData.users;
            }
            return map;
        }, {});
        const distributeValueOverPoints = (usersListsMap, dateOffset, count, array) => {
            const usersSet = new Set();
            for (let k = dateOffset; count > 0; k--, count--) {
                if (usersListsMap[k]) {
                    usersListsMap[k].map((userId) => usersSet.add(userId));
                }
            }
            array[dateOffset].y = usersSet.size;
        };
        for (let i = 0; i < dauValuesLocal.length; i++) {
            distributeValueOverPoints(usersListsMap, i, 7, wauValuesLocal);
            distributeValueOverPoints(usersListsMap, i, 30, mauValuesLocal);
        }
        prevWauValue.y = wauValuesLocal[dauValuesLocal.length - 2].y;
        prevMauValue.y = mauValuesLocal[dauValuesLocal.length - 2].y;
        prevDauValue.y = dauValuesLocal[dauValuesLocal.length - 2].y;
        return [
            dauValuesLocal[dauValuesLocal.length - 1].y,
            dauValuesLocal[dauValuesLocal.length - 1].y - prevDauValue.y,
            wauValuesLocal[wauValuesLocal.length - 1].y,
            wauValuesLocal[wauValuesLocal.length - 1].y - prevWauValue.y,
            mauValuesLocal[mauValuesLocal.length - 1].y,
            mauValuesLocal[mauValuesLocal.length - 1].y - prevMauValue.y,
            dauValuesLocal,
            wauValuesLocal,
            mauValuesLocal,
        ];
    }, [data, utc]);
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(EngagementDashboardCardFilter_1.default, { children: (0, jsx_runtime_1.jsx)(DownloadDataButton_1.default, { attachmentName: `ActiveUsersSection_start_${data === null || data === void 0 ? void 0 : data.start}_end_${(0, moment_1.default)(data === null || data === void 0 ? void 0 : data.end).subtract(1, 'day')}`, headers: ['Date', 'DAU', 'WAU', 'MAU'], dataAvailable: !!data, dataExtractor: () => {
                        const values = [];
                        for (let i = 0; i < 30; i++) {
                            values.push([dauValues[i].x.toISOString(), dauValues[i].y, wauValues[i].y, mauValues[i].y]);
                        }
                        return values;
                    } }) }), (0, jsx_runtime_1.jsx)(CounterSet_1.default, { counters: [
                    {
                        count: countDailyActiveUsers !== null && countDailyActiveUsers !== void 0 ? countDailyActiveUsers : (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: '3ex', height: '1em' }),
                        variation: diffDailyActiveUsers !== null && diffDailyActiveUsers !== void 0 ? diffDailyActiveUsers : 0,
                        description: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LegendSymbol_1.default, { color: colors_json_1.default.b200 }), " ", t('Daily_Active_Users')] })),
                    },
                    {
                        count: countWeeklyActiveUsers !== null && countWeeklyActiveUsers !== void 0 ? countWeeklyActiveUsers : (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: '3ex', height: '1em' }),
                        variation: diffWeeklyActiveUsers !== null && diffWeeklyActiveUsers !== void 0 ? diffWeeklyActiveUsers : 0,
                        description: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LegendSymbol_1.default, { color: colors_json_1.default.b300 }), " ", t('Weekly_Active_Users')] })),
                    },
                    {
                        count: countMonthlyActiveUsers !== null && countMonthlyActiveUsers !== void 0 ? countMonthlyActiveUsers : (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: '3ex', height: '1em' }),
                        variation: diffMonthlyActiveUsers !== null && diffMonthlyActiveUsers !== void 0 ? diffMonthlyActiveUsers : 0,
                        description: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LegendSymbol_1.default, { color: colors_json_1.default.p500 }), " ", t('Monthly_Active_Users')] })),
                    },
                ] }), (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { children: data ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: { height: 240 }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { align: 'stretch', grow: 1, shrink: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: { position: 'relative' }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                }, children: (0, jsx_runtime_1.jsx)(line_1.ResponsiveLine, { data: [
                                        {
                                            id: 'dau',
                                            data: dauValues,
                                        },
                                        {
                                            id: 'wau',
                                            data: wauValues,
                                        },
                                        {
                                            id: 'mau',
                                            data: mauValues,
                                        },
                                    ], xScale: {
                                        type: 'time',
                                        format: 'native',
                                        precision: 'day',
                                    }, xFormat: 'time:%Y-%m-%d', yScale: {
                                        type: 'linear',
                                        stacked: true,
                                    }, enableGridX: false, enableGridY: false, enablePoints: false, useMesh: true, enableArea: true, areaOpacity: 1, enableCrosshair: true, crosshairType: 'bottom', margin: {
                                        // TODO: Get it from theme
                                        top: 0,
                                        bottom: 20,
                                        right: 0,
                                        left: 40,
                                    }, colors: [colors_json_1.default.b200, colors_json_1.default.b300, colors_json_1.default.b500], axisLeft: {
                                        // TODO: Get it from theme
                                        tickSize: 0,
                                        tickPadding: 4,
                                        tickRotation: 0,
                                        tickValues: 3,
                                    }, axisBottom: {
                                        // TODO: Get it from theme
                                        tickSize: 0,
                                        tickPadding: 4,
                                        tickRotation: 0,
                                        tickValues: 'every 3 days',
                                        format: (date) => (0, moment_1.default)(date).format('DD/MM'),
                                    }, animate: true, motionConfig: 'stiff', theme: {
                                        // TODO: Get it from theme
                                        axis: {
                                            ticks: {
                                                text: {
                                                    fill: '#9EA2A8',
                                                    fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
                                                    fontSize: '10px',
                                                    fontStyle: 'normal',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.2px',
                                                    lineHeight: '12px',
                                                },
                                            },
                                        },
                                        tooltip: {
                                            container: {
                                                backgroundColor: '#1F2329',
                                                boxShadow: '0px 0px 12px rgba(47, 52, 61, 0.12), 0px 0px 2px rgba(47, 52, 61, 0.08)',
                                                borderRadius: 2,
                                            },
                                        },
                                    }, enableSlices: 'x', sliceTooltip: ({ slice: { points } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Tile, { elevation: '2', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: formatDate(points[0].data.x) }), points.map(({ serieId, data: { y: activeUsers } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p1m', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (serieId === 'dau' && t('DAU_value', { value: activeUsers })) ||
                                                            (serieId === 'wau' && t('WAU_value', { value: activeUsers })) ||
                                                            (serieId === 'mau' && t('MAU_value', { value: activeUsers })) }) }, serieId)))] }) })) }) }) }) }) })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 240 })) })] }));
};
exports.default = ActiveUsersSection;
