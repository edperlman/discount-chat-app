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
const fuselage_1 = require("@rocket.chat/fuselage");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const DownloadDataButton_1 = __importDefault(require("../../../../components/dashboards/DownloadDataButton"));
const PeriodSelector_1 = __importDefault(require("../../../../components/dashboards/PeriodSelector"));
const usePeriodSelectorState_1 = require("../../../../components/dashboards/usePeriodSelectorState");
const Growth_1 = __importDefault(require("../../../../components/dataView/Growth"));
const EngagementDashboardCardFilter_1 = __importDefault(require("../EngagementDashboardCardFilter"));
const useChannelsList_1 = require("./useChannelsList");
const ChannelsOverview = () => {
    const [period, periodSelectorProps] = (0, usePeriodSelectorState_1.usePeriodSelectorState)('last 7 days', 'last 30 days', 'last 90 days');
    const { t } = (0, react_i18next_1.useTranslation)();
    const [current, setCurrent] = (0, react_1.useState)(0);
    const [itemsPerPage, setItemsPerPage] = (0, react_1.useState)(25);
    const { data } = (0, useChannelsList_1.useChannelsList)({
        period,
        offset: current,
        count: itemsPerPage,
    });
    const channels = (0, react_1.useMemo)(() => {
        var _a;
        if (!data) {
            return;
        }
        return (_a = data === null || data === void 0 ? void 0 : data.channels) === null || _a === void 0 ? void 0 : _a.map(({ room: { t, name, usernames, ts, _updatedAt }, messages, diffFromLastWeek }) => ({
            t,
            name: name || (usernames === null || usernames === void 0 ? void 0 : usernames.join(' × ')),
            createdAt: ts,
            updatedAt: _updatedAt,
            messagesCount: messages,
            messagesVariation: diffFromLastWeek,
        }));
    }, [data]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(EngagementDashboardCardFilter_1.default, { children: [(0, jsx_runtime_1.jsx)(PeriodSelector_1.default, Object.assign({}, periodSelectorProps)), (0, jsx_runtime_1.jsx)(DownloadDataButton_1.default, { attachmentName: `Channels_start_${data === null || data === void 0 ? void 0 : data.start}_end_${data === null || data === void 0 ? void 0 : data.end}`, headers: ['Room type', 'Name', 'Messages', 'Last Update Date', 'Creation Date'], dataAvailable: !!data, dataExtractor: () => {
                            var _a;
                            return (_a = data === null || data === void 0 ? void 0 : data.channels) === null || _a === void 0 ? void 0 : _a.map(({ room: { t, name, usernames, ts, _updatedAt }, messages }) => [
                                t,
                                name || (usernames === null || usernames === void 0 ? void 0 : usernames.join(' × ')),
                                messages,
                                _updatedAt,
                                ts,
                            ]);
                        } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [channels && !channels.length && ((0, jsx_runtime_1.jsx)(fuselage_1.Tile, { fontScale: 'p1', color: 'hint', style: { textAlign: 'center' }, children: t('No_data_found') })), (!channels || channels.length) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Table, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableHead, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: "#" }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: t('Channel') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: t('Created') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: t('Last_active') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: t('Messages_sent') })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.TableBody, { children: [channels === null || channels === void 0 ? void 0 : channels.map(({ t, name, createdAt, updatedAt, messagesCount, messagesVariation }, i) => ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.TableCell, { children: [i + 1, "."] }), (0, jsx_runtime_1.jsxs)(fuselage_1.TableCell, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inlineEnd: 4, children: (t === 'd' && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'at' })) || (t === 'p' && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'lock' })) || (t === 'c' && (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'hashtag' })) }), name] }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, moment_1.default)(createdAt).format('L') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, moment_1.default)(updatedAt).format('L') }), (0, jsx_runtime_1.jsxs)(fuselage_1.TableCell, { children: [messagesCount, " ", (0, jsx_runtime_1.jsx)(Growth_1.default, { children: messagesVariation })] })] }, i))), !channels &&
                                        Array.from({ length: 5 }, (_, i) => ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) })] }, i)))] })] })), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, { current: current, itemsPerPage: itemsPerPage, itemsPerPageLabel: () => t('Items_per_page:'), showingResultsLabel: ({ count, current, itemsPerPage }) => t('Showing_results_of', { postProcess: 'sprintf', sprintf: [current + 1, Math.min(current + itemsPerPage, count), count] }), count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: setItemsPerPage, onSetCurrent: setCurrent })] })] }));
};
exports.default = ChannelsOverview;
