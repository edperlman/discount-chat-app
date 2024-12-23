"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSeatsCap = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useSeatsCap = () => {
    // #TODO: Stop using this endpoint
    const fetch = (0, ui_contexts_1.useEndpoint)('GET', '/v1/licenses.maxActiveUsers');
    const result = (0, react_query_1.useQuery)(['/v1/licenses.maxActiveUsers'], () => fetch());
    if (!result.isSuccess) {
        return undefined;
    }
    return {
        activeUsers: result.data.activeUsers,
        maxActiveUsers: result.data.maxActiveUsers && result.data.maxActiveUsers > 0 ? result.data.maxActiveUsers : Number.POSITIVE_INFINITY,
        reload: () => result.refetch(),
    };
};
exports.useSeatsCap = useSeatsCap;
