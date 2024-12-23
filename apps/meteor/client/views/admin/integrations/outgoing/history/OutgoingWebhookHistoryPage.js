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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const HistoryContent_1 = __importDefault(require("./HistoryContent"));
const SDKClient_1 = require("../../../../../../app/utils/client/lib/SDKClient");
const CustomScrollbars_1 = require("../../../../../components/CustomScrollbars");
const usePagination_1 = require("../../../../../components/GenericTable/hooks/usePagination");
const Page_1 = require("../../../../../components/Page");
const OutgoingWebhookHistoryPage = (props) => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const { itemsPerPage, setItemsPerPage, current, setCurrent, itemsPerPageLabel, showingResultsLabel } = (0, usePagination_1.usePagination)();
    const [mounted, setMounted] = (0, react_1.useState)(false);
    const [total, setTotal] = (0, react_1.useState)(0);
    const clearIntegrationHistory = (0, ui_contexts_1.useMethod)('clearIntegrationHistory');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const query = (0, react_1.useMemo)(() => ({
        id,
        count: itemsPerPage,
        offset: current,
    }), [id, itemsPerPage, current]);
    const fetchHistory = (0, ui_contexts_1.useEndpoint)('GET', '/v1/integrations.history');
    const queryKey = (0, react_1.useMemo)(() => ['integrations/history', id, itemsPerPage, current], [id, itemsPerPage, current]);
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data, isLoading, refetch } = (0, react_query_1.useQuery)(queryKey, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = fetchHistory(query);
        setMounted(true);
        return result;
    }), {
        cacheTime: 99999,
        staleTime: 99999,
    });
    const handleClearHistory = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield clearIntegrationHistory(id);
            dispatchToastMessage({ type: 'success', message: t('Integration_History_Cleared') });
            refetch();
            setMounted(false);
        }
        catch (e) {
            dispatchToastMessage({ type: 'error', message: e });
        }
    });
    (0, react_1.useEffect)(() => {
        if (mounted) {
            return SDKClient_1.sdk.stream('integrationHistory', [id], (integration) => {
                if (integration.type === 'inserted') {
                    setTotal((total) => total + 1);
                    queryClient.setQueryData(queryKey, (oldData) => {
                        if (!oldData || !integration.data) {
                            return;
                        }
                        return Object.assign(Object.assign({}, oldData), { history: [integration.data].concat(oldData.history), total: oldData.total + 1 });
                    });
                }
                if (integration.type === 'updated') {
                    queryClient.setQueryData(queryKey, (oldData) => {
                        if (!oldData) {
                            return;
                        }
                        const index = oldData.history.findIndex(({ _id }) => _id === id);
                        if (index === -1) {
                            return;
                        }
                        Object.assign(oldData.history[index], integration.diff);
                        return Object.assign({}, oldData);
                    });
                    return;
                }
                if (integration.type === 'removed') {
                    refetch();
                }
            }).stop;
        }
    }, [id, mounted, queryClient, queryKey, refetch]);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, Object.assign({ flexDirection: 'column' }, props, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Integration_Outgoing_WebHook_History'), onClickBack: () => router.navigate(`/admin/integrations/edit/outgoing/${id}`), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, onClick: handleClearHistory, disabled: total === 0, children: t('clear_history') }) }) }), (0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [(0, jsx_runtime_1.jsx)(CustomScrollbars_1.CustomScrollbars, { children: (0, jsx_runtime_1.jsx)(HistoryContent_1.default, { data: (data === null || data === void 0 ? void 0 : data.history) || [], isLoading: isLoading }, 'historyContent') }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, { current: current, itemsPerPage: itemsPerPage, itemsPerPageLabel: itemsPerPageLabel, showingResultsLabel: showingResultsLabel, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetItemsPerPage: setItemsPerPage, onSetCurrent: setCurrent })] })] })));
};
exports.default = OutgoingWebhookHistoryPage;
