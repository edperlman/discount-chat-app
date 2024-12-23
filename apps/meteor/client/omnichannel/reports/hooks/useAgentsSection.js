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
exports.useAgentsSection = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useDefaultDownload_1 = require("./useDefaultDownload");
const useSort_1 = require("../../../components/GenericTable/hooks/useSort");
const periods_1 = require("../../../components/dashboards/periods");
const usePeriodSelectorStorage_1 = require("../../../components/dashboards/usePeriodSelectorStorage");
const constants_1 = require("../components/constants");
const formatPeriodDescription_1 = require("../utils/formatPeriodDescription");
const formatChartData = (data = []) => data.map((item) => (Object.assign(Object.assign({}, item), { color: constants_1.COLORS.info })));
const useAgentsSection = () => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const [period, periodSelectorProps] = (0, usePeriodSelectorStorage_1.usePeriodSelectorStorage)('reports-agents-period', constants_1.PERIOD_OPTIONS);
    const getConversationsByAgent = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/analytics/dashboards/conversations-by-agent');
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('total', 'desc');
    const { data: { data, total = 0, unspecified = 0 } = { data: [], total: 0 }, refetch, isLoading, isError, isSuccess, } = (0, react_query_1.useQuery)(['omnichannel-reports', 'conversations-by-agent', period, sortBy, sortDirection], () => __awaiter(void 0, void 0, void 0, function* () {
        const { start, end } = (0, periods_1.getPeriodRange)(period);
        const response = yield getConversationsByAgent({
            start: start.toISOString(),
            end: end.toISOString(),
            sort: JSON.stringify({ [sortBy]: sortDirection === 'asc' ? 1 : -1 }),
        });
        return Object.assign(Object.assign({}, response), { data: formatChartData(response.data) });
    }), {
        refetchInterval: 5 * 60 * 1000,
    });
    const title = t('Conversations_by_agents');
    const subtitleTotals = t('__agents__agents_and__count__conversations__period__', {
        agents: (_a = data.length) !== null && _a !== void 0 ? _a : 0,
        count: total,
        period: (0, formatPeriodDescription_1.formatPeriodDescription)(period, t),
    });
    const subtitleUnspecified = unspecified > 0 ? `(${t('__count__without__assignee__', { count: unspecified })})` : '';
    const subtitle = `${subtitleTotals} ${subtitleUnspecified}`;
    const emptyStateSubtitle = t('Omnichannel_Reports_Agents_Empty_Subtitle');
    const downloadProps = (0, useDefaultDownload_1.useDefaultDownload)({ columnName: t('Agents'), title, data, period });
    return (0, react_1.useMemo)(() => ({
        id: 'conversations-by-agent',
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
        sortBy,
        sortDirection,
        setSort,
        onRetry: refetch,
    }), [
        title,
        subtitle,
        emptyStateSubtitle,
        data,
        total,
        isLoading,
        isError,
        isSuccess,
        periodSelectorProps,
        period,
        downloadProps,
        sortBy,
        sortDirection,
        setSort,
        refetch,
    ]);
};
exports.useAgentsSection = useAgentsSection;
