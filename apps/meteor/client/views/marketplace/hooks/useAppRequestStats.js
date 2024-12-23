"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppRequestStats = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useAppRequestStats = () => {
    const canManageApp = (0, ui_contexts_1.usePermission)('manage-apps');
    const fetchRequestStats = (0, ui_contexts_1.useEndpoint)('GET', '/apps/app-request/stats');
    return (0, react_query_1.useQuery)({
        queryKey: ['app-requests-stats'],
        queryFn: () => fetchRequestStats(),
        select: ({ data }) => data,
        refetchOnWindowFocus: false,
        retry: false,
        enabled: canManageApp,
    });
};
exports.useAppRequestStats = useAppRequestStats;
