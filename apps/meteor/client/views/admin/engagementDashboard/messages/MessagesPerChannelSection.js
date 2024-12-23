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
const pie_1 = require("@nivo/pie");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useMessageOrigins_1 = require("./useMessageOrigins");
const useTopFivePopularChannels_1 = require("./useTopFivePopularChannels");
const DownloadDataButton_1 = __importDefault(require("../../../../components/dashboards/DownloadDataButton"));
const PeriodSelector_1 = __importDefault(require("../../../../components/dashboards/PeriodSelector"));
const usePeriodSelectorState_1 = require("../../../../components/dashboards/usePeriodSelectorState");
const EngagementDashboardCardFilter_1 = __importDefault(require("../EngagementDashboardCardFilter"));
const LegendSymbol_1 = __importDefault(require("../dataView/LegendSymbol"));
const colors = {
    warning: fuselage_1.Palette.statusColor['status-font-on-warning'].toString(),
    success: fuselage_1.Palette.statusColor['status-font-on-success'].toString(),
    info: fuselage_1.Palette.statusColor['status-font-on-info'].toString(),
};
const MessagesPerChannelSection = () => {
    const [period, periodSelectorProps] = (0, usePeriodSelectorState_1.usePeriodSelectorState)('last 7 days', 'last 30 days', 'last 90 days');
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data: messageOriginsData } = (0, useMessageOrigins_1.useMessageOrigins)({ period });
    const { data: topFivePopularChannelsData } = (0, useTopFivePopularChannels_1.useTopFivePopularChannels)({ period });
    const pie = (0, react_1.useMemo)(() => { var _a; return (_a = messageOriginsData === null || messageOriginsData === void 0 ? void 0 : messageOriginsData.origins) === null || _a === void 0 ? void 0 : _a.reduce((obj, { messages, t }) => (Object.assign(Object.assign({}, obj), { [t]: messages })), {}); }, [messageOriginsData]);
    const table = (0, react_1.useMemo)(() => {
        var _a;
        return (_a = topFivePopularChannelsData === null || topFivePopularChannelsData === void 0 ? void 0 : topFivePopularChannelsData.channels) === null || _a === void 0 ? void 0 : _a.reduce((entries, { t, messages, name, usernames }, i) => [...entries, { i, t, name: name || (usernames === null || usernames === void 0 ? void 0 : usernames.join(' × ')), messages }], []);
    }, [topFivePopularChannelsData]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(EngagementDashboardCardFilter_1.default, { children: [(0, jsx_runtime_1.jsx)(PeriodSelector_1.default, Object.assign({}, periodSelectorProps)), (0, jsx_runtime_1.jsx)(DownloadDataButton_1.default, { attachmentName: `MessagesPerChannelSection_start_${messageOriginsData === null || messageOriginsData === void 0 ? void 0 : messageOriginsData.start}_end_${messageOriginsData === null || messageOriginsData === void 0 ? void 0 : messageOriginsData.end}`, headers: ['Room Type', 'Messages'], dataAvailable: !!messageOriginsData, dataExtractor: () => messageOriginsData === null || messageOriginsData === void 0 ? void 0 : messageOriginsData.origins.map(({ t, messages }) => [t, messages]) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 'neg-x12', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 12, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { grow: 1, shrink: 0, basis: '0', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Container, { alignItems: 'center', wrap: 'no-wrap', children: pie ? ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { grow: 1, shrink: 1, children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 24, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                                                    position: 'relative',
                                                                    height: 300,
                                                                }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { style: {
                                                                        position: 'absolute',
                                                                        width: '100%',
                                                                        height: '100%',
                                                                    }, children: (0, jsx_runtime_1.jsx)(pie_1.ResponsivePie, { data: [
                                                                            {
                                                                                id: 'd',
                                                                                label: t('Direct_Messages'),
                                                                                value: pie.d,
                                                                                color: colors.warning,
                                                                            },
                                                                            {
                                                                                id: 'p',
                                                                                label: t('Private_Channels'),
                                                                                value: pie.p,
                                                                                color: colors.success,
                                                                            },
                                                                            {
                                                                                id: 'c',
                                                                                label: t('Public_Channels'),
                                                                                value: pie.c,
                                                                                color: colors.info,
                                                                            },
                                                                        ], innerRadius: 0.6, colors: [colors.warning, colors.success, colors.info], animate: true, motionConfig: 'stiff', theme: {
                                                                            // TODO: Get it from theme
                                                                            axis: {
                                                                                ticks: {
                                                                                    text: {
                                                                                        fill: '#9EA2A8',
                                                                                        fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI", Arial, sans-serif',
                                                                                        fontSize: 10,
                                                                                        fontStyle: 'normal',
                                                                                        fontWeight: 600,
                                                                                        letterSpacing: '0.2px',
                                                                                        lineHeight: '12px',
                                                                                    },
                                                                                },
                                                                            },
                                                                        }, tooltip: ({ datum }) => (0, jsx_runtime_1.jsx)(fuselage_1.Tooltip, { children: t('Value_messages', { value: datum.value }) }) }) }) }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { basis: 'auto', children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { block: 'neg-x4', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 4, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'hint', fontScale: 'p1', children: [(0, jsx_runtime_1.jsx)(LegendSymbol_1.default, { color: colors.warning }), t('Private_Chats')] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'hint', fontScale: 'p1', children: [(0, jsx_runtime_1.jsx)(LegendSymbol_1.default, { color: colors.success }), t('Private_Channels')] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'hint', fontScale: 'p1', children: [(0, jsx_runtime_1.jsx)(LegendSymbol_1.default, { color: colors.info }), t('Public_Channels')] })] }) }) }) })] })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 300 })) }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Flex.Item, { grow: 1, shrink: 0, basis: '0', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Margins, { blockEnd: 16, children: table ? (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p1', children: t('Most_popular_channels_top_5') }) : (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '50%' }) }), table && !table.length && ((0, jsx_runtime_1.jsx)(fuselage_1.Tile, { fontScale: 'p1', color: 'hint', style: { textAlign: 'center' }, children: t('Not_enough_data') })), (!table || !!table.length) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Table, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableHead, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: "#" }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: t('Channel') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'end', children: t('Number_of_messages') })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.TableBody, { children: [table === null || table === void 0 ? void 0 : table.map(({ i, t, name, messages }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.TableCell, { children: [i + 1, "."] }), (0, jsx_runtime_1.jsxs)(fuselage_1.TableCell, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inlineEnd: 4, children: (t === 'd' && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'at' })) ||
                                                                                    (t === 'p' && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'lock' })) ||
                                                                                    (t === 'c' && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'hashtag' })) }), name] }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'end', children: messages })] }, i))), !table &&
                                                                Array.from({ length: 5 }, (_, i) => ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'end', children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) })] }, i)))] })] }))] }) })] }) }) }) })] }));
};
exports.default = MessagesPerChannelSection;
