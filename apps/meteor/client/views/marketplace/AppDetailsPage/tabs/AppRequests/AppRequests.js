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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AppRequestItem_1 = __importDefault(require("./AppRequestItem"));
const AppRequestsLoading_1 = __importDefault(require("./AppRequestsLoading"));
const useAppsReload_1 = require("../../../../../contexts/hooks/useAppsReload");
const queryClient_1 = require("../../../../../lib/queryClient");
const useAppRequests_1 = require("../../../hooks/useAppRequests");
const AppRequests = ({ id, isAdminUser }) => {
    var _a, _b;
    const [limit, setLimit] = (0, react_1.useState)(25);
    const [offset, setOffset] = (0, react_1.useState)(0);
    const paginatedAppRequests = (0, useAppRequests_1.useAppRequests)(id, limit, offset);
    const { t } = (0, react_i18next_1.useTranslation)();
    const onSetItemsPerPage = (itemsPerPageOption) => setLimit(itemsPerPageOption);
    const onSetCurrent = (currentItemsOption) => setOffset(currentItemsOption);
    const reloadApps = (0, useAppsReload_1.useAppsReload)();
    const markSeen = (0, ui_contexts_1.useEndpoint)('POST', '/apps/app-request/markAsSeen');
    const markAppRequestsAsSeen = (0, react_query_1.useMutation)({
        mutationKey: ['mark-app-requests-as-seen'],
        mutationFn: (unseenRequests) => markSeen({ unseenRequests }),
        retry: false,
    });
    (0, react_1.useEffect)(() => {
        return () => {
            if (isAdminUser && paginatedAppRequests.isSuccess) {
                const unseenRequests = paginatedAppRequests.data.data.filter(({ seen }) => !seen).map(({ id }) => id);
                if (unseenRequests.length) {
                    markAppRequestsAsSeen.mutate(unseenRequests, {
                        onSuccess: () => {
                            queryClient_1.queryClient.refetchQueries({ queryKey: ['app-requests-stats'] });
                            reloadApps();
                        },
                    });
                }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdminUser, paginatedAppRequests.isSuccess, paginatedAppRequests === null || paginatedAppRequests === void 0 ? void 0 : paginatedAppRequests.data, reloadApps]);
    if (paginatedAppRequests.isLoading) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'full', maxWidth: 'x608', marginInline: 'auto', pbs: 36, children: (0, jsx_runtime_1.jsx)(AppRequestsLoading_1.default, {}) }));
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { h: 'full', display: 'flex', flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'full', maxWidth: 'x608', marginInline: 'auto', pbs: 36, flexGrow: '1', children: paginatedAppRequests.isSuccess && ((_a = paginatedAppRequests.data.data) === null || _a === void 0 ? void 0 : _a.length) ? (paginatedAppRequests.data.data.map((request) => ((0, jsx_runtime_1.jsx)(AppRequestItem_1.default, { seen: request.seen, name: request.requester.name, createdDate: request.createdDate, message: request.message, username: request.requester.username }, request.id)))) : ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('No_requests') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('App_requests_by_workspace') })] })) }), paginatedAppRequests.isSuccess && ((_b = paginatedAppRequests.data.data) === null || _b === void 0 ? void 0 : _b.length) && ((0, jsx_runtime_1.jsx)(fuselage_1.Pagination, { divider: true, count: paginatedAppRequests.data.meta.total, itemsPerPage: paginatedAppRequests.data.meta.limit, current: paginatedAppRequests.data.meta.offset, onSetItemsPerPage: onSetItemsPerPage, onSetCurrent: onSetCurrent }))] }));
};
exports.default = AppRequests;
