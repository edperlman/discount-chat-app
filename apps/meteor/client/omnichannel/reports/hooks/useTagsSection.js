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
exports.useTagsSection = void 0;
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useDefaultDownload_1 = require("./useDefaultDownload");
const periods_1 = require("../../../components/dashboards/periods");
const usePeriodSelectorStorage_1 = require("../../../components/dashboards/usePeriodSelectorStorage");
const constants_1 = require("../components/constants");
const formatPeriodDescription_1 = require("../utils/formatPeriodDescription");
const colors = {
    warning: fuselage_1.Palette.statusColor['status-font-on-warning'].toString(),
    danger: fuselage_1.Palette.statusColor['status-font-on-danger'].toString(),
    success: fuselage_1.Palette.statusColor['status-font-on-success'].toString(),
    info: fuselage_1.Palette.statusColor['status-font-on-info'].toString(),
};
const formatChartData = (data = []) => data.map((item) => (Object.assign(Object.assign({}, item), { color: colors.info })));
const useTagsSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [period, periodSelectorProps] = (0, usePeriodSelectorStorage_1.usePeriodSelectorStorage)('reports-tags-period', constants_1.PERIOD_OPTIONS);
    const getConversationsByTags = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/analytics/dashboards/conversations-by-tags');
    const { data: { data, total = 0, unspecified = 0 } = { data: [], total: 0 }, refetch, isLoading, isError, isSuccess, } = (0, react_query_1.useQuery)(['omnichannel-reports', 'conversations-by-tags', period], () => __awaiter(void 0, void 0, void 0, function* () {
        const { start, end } = (0, periods_1.getPeriodRange)(period);
        const response = yield getConversationsByTags({ start: start.toISOString(), end: end.toISOString() });
        return Object.assign(Object.assign({}, response), { data: formatChartData(response.data) });
    }), {
        refetchInterval: 5 * 60 * 1000,
    });
    const title = t('Conversations_by_tag');
    const subtitleTotals = t('__count__tags__and__count__conversations__period__', {
        count: data.length,
        conversations: total,
        period: (0, formatPeriodDescription_1.formatPeriodDescription)(period, t),
    });
    const subtitleUnspecified = unspecified > 0 ? `(${t('__count__without__tags__', { count: unspecified })})` : '';
    const subtitle = `${subtitleTotals} ${subtitleUnspecified}`;
    const emptyStateSubtitle = t('Omnichannel_Reports_Tags_Empty_Subtitle');
    const downloadProps = (0, useDefaultDownload_1.useDefaultDownload)({ columnName: t('Tags'), title, data, period });
    return (0, react_1.useMemo)(() => ({
        id: 'conversations-by-tags',
        title,
        subtitle,
        emptyStateSubtitle,
        data,
        total,
        period,
        periodSelectorProps,
        downloadProps,
        isError,
        isLoading,
        isDataFound: isSuccess && data.length > 0,
        onRetry: refetch,
    }), [title, subtitle, emptyStateSubtitle, data, total, isError, isLoading, isSuccess, periodSelectorProps, period, downloadProps, refetch]);
};
exports.useTagsSection = useTagsSection;
