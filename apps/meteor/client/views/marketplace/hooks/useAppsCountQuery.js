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
exports.useInvalidateAppsCountQueryCallback = exports.useAppsCountQuery = void 0;
exports.isMarketplaceRouteContext = isMarketplaceRouteContext;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
function isMarketplaceRouteContext(context) {
    return ['private', 'explore', 'installed', 'premium', 'requested'].includes(context);
}
const useAppsCountQuery = (context) => {
    const getAppsCount = (0, ui_contexts_1.useEndpoint)('GET', '/apps/count');
    return (0, react_query_1.useQuery)(['apps/count', context], () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield getAppsCount();
        const numberOfEnabledApps = context === 'private' ? data.totalPrivateEnabled : data.totalMarketplaceEnabled;
        const enabledAppsLimit = context === 'private' ? data.maxPrivateApps : data.maxMarketplaceApps;
        const hasUnlimitedApps = enabledAppsLimit === -1;
        return {
            hasUnlimitedApps,
            enabled: numberOfEnabledApps,
            limit: enabledAppsLimit,
            // tooltip,
        };
    }), { staleTime: 10000 });
};
exports.useAppsCountQuery = useAppsCountQuery;
const useInvalidateAppsCountQueryCallback = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_1.useCallback)(() => {
        queryClient.invalidateQueries(['apps/count']);
    }, [queryClient]);
};
exports.useInvalidateAppsCountQueryCallback = useInvalidateAppsCountQueryCallback;
