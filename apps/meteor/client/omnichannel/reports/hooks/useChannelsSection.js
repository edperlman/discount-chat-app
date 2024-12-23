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
exports.useChannelsSection = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useDefaultDownload_1 = require("./useDefaultDownload");
const periods_1 = require("../../../components/dashboards/periods");
const usePeriodSelectorStorage_1 = require("../../../components/dashboards/usePeriodSelectorStorage");
const constants_1 = require("../components/constants");
const formatPeriodDescription_1 = require("../utils/formatPeriodDescription");
const getTop_1 = require("../utils/getTop");
const round_1 = require("../utils/round");
const TYPE_LABEL = {
    'widget': 'Livechat',
    'email-inbox': 'Email',
    'twilio': 'SMS',
    'api': 'Custom_Integration',
};
const formatItem = (item, total, t) => {
    const percentage = total > 0 ? (0, round_1.round)((item.value / total) * 100) : 0;
    const label = `${t(TYPE_LABEL[item.label]) || (0, string_helpers_1.capitalize)(item.label)}`;
    return Object.assign(Object.assign({}, item), { label: `${label} ${item.value} (${percentage}%)`, rawLabel: label, id: item.label });
};
const formatChartData = (data = [], total = 0, t) => {
    return data.map((item) => formatItem(item, total, t));
};
const useChannelsSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [period, periodSelectorProps] = (0, usePeriodSelectorStorage_1.usePeriodSelectorStorage)('reports-channels-period', constants_1.PERIOD_OPTIONS);
    const getConversationsBySource = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/analytics/dashboards/conversations-by-source');
    const { data: { data, rawData, total } = { data: [], rawData: [], total: 0 }, refetch, isLoading, isError, isSuccess, } = (0, react_query_1.useQuery)(['omnichannel-reports', 'conversations-by-source', period], () => __awaiter(void 0, void 0, void 0, function* () {
        const { start, end } = (0, periods_1.getPeriodRange)(period);
        const response = yield getConversationsBySource({ start: start.toISOString(), end: end.toISOString() });
        const data = formatChartData(response.data, response.total, t);
        const displayData = (0, getTop_1.getTop)(5, data, (value) => formatItem({ label: t('Others'), value }, response.total, t));
        return Object.assign(Object.assign({}, response), { data: displayData, rawData: data });
    }), {
        refetchInterval: 5 * 60 * 1000,
    });
    const title = t('Conversations_by_channel');
    const subtitle = t('__count__conversations__period__', {
        count: total !== null && total !== void 0 ? total : 0,
        period: (0, formatPeriodDescription_1.formatPeriodDescription)(period, t),
    });
    const emptyStateSubtitle = t('Omnichannel_Reports_Channels_Empty_Subtitle');
    const downloadProps = (0, useDefaultDownload_1.useDefaultDownload)({ columnName: t('Channel'), title, data: rawData, period });
    return (0, react_1.useMemo)(() => ({
        id: 'conversations-by-channel',
        title,
        subtitle,
        emptyStateSubtitle,
        data,
        total,
        isLoading,
        isError,
        isDataFound: isSuccess && data.length > 0,
        periodSelectorProps,
        period,
        downloadProps,
        onRetry: refetch,
    }), [title, subtitle, emptyStateSubtitle, data, total, isLoading, isError, isSuccess, periodSelectorProps, period, downloadProps, refetch]);
};
exports.useChannelsSection = useChannelsSection;
