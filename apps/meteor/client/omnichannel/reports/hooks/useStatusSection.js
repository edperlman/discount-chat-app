"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStatusSection = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useDefaultDownload_1 = require("./useDefaultDownload");
const periods_1 = require("../../../components/dashboards/periods");
const usePeriodSelectorStorage_1 = require("../../../components/dashboards/usePeriodSelectorStorage");
const constants_1 = require("../components/constants");
const formatPeriodDescription_1 = require("../utils/formatPeriodDescription");
const round_1 = require("../utils/round");
const STATUSES = {
    Open: { label: 'Omnichannel_Reports_Status_Open', color: constants_1.COLORS.success },
    Queued: { label: 'Queued', color: constants_1.COLORS.warning2 },
    On_Hold: { label: 'On_Hold', color: constants_1.COLORS.warning },
    Closed: { label: 'Omnichannel_Reports_Status_Closed', color: constants_1.COLORS.danger },
};
const formatChartData = (data = [], total = 0, t) => {
    return data.map((item) => {
        const status = STATUSES[item.label];
        const percentage = total > 0 ? (0, round_1.round)((item.value / total) * 100) : 0;
        const label = t(status.label);
        return Object.assign(Object.assign({}, item), { id: item.label, label: `${label} ${item.value} (${percentage}%)`, rawLabel: label, color: status.color });
    });
};
const useStatusSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [period, periodSelectorProps] = (0, usePeriodSelectorStorage_1.usePeriodSelectorStorage)('reports-status-period', constants_1.PERIOD_OPTIONS);
    const getConversationsByStatus = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/analytics/dashboards/conversations-by-status');
    const { start, end } = (0, periods_1.getPeriodRange)(period);
    const { data: { data, total } = { data: [], total: 0 }, isLoading, isError, isSuccess, refetch, } = (0, react_query_1.useQuery)(['omnichannel-reports', 'conversations-by-status', period, t], () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield getConversationsByStatus({ start: start.toISOString(), end: end.toISOString() });
        return Object.assign(Object.assign({}, response), { data: formatChartData(response.data, response.total, t) });
    }), {
        refetchInterval: 5 * 60 * 1000,
    });
    const title = t('Conversations_by_status');
    const subtitle = t('__count__conversations__period__', {
        count: total !== null && total !== void 0 ? total : 0,
        period: (0, formatPeriodDescription_1.formatPeriodDescription)(period, t),
    });
    const emptyStateSubtitle = t('Omnichannel_Reports_Status_Empty_Subtitle');
    const downloadProps = (0, useDefaultDownload_1.useDefaultDownload)({ columnName: t('Status'), title, data, period });
    return (0, react_1.useMemo)(() => ({
        id: 'conversations-by-status',
        title,
        subtitle,
        emptyStateSubtitle,
        data,
        total,
        period,
        periodSelectorProps,
        downloadProps,
        isLoading,
        isError,
        isDataFound: isSuccess && data.length > 0,
        onRetry: refetch,
    }), [title, subtitle, emptyStateSubtitle, data, total, period, periodSelectorProps, downloadProps, isLoading, isError, isSuccess, refetch]);
};
exports.useStatusSection = useStatusSection;
