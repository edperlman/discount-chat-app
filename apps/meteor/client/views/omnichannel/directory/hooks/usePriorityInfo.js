"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePriorityInfo = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useOmnichannelPriorities_1 = require("../../../../omnichannel/hooks/useOmnichannelPriorities");
const usePriorityInfo = (priorityId) => {
    const { enabled } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    const getPriority = (0, ui_contexts_1.useEndpoint)('GET', `/v1/livechat/priorities/:priorityId`, { priorityId });
    return (0, react_query_1.useQuery)(['/v1/livechat/priorities', priorityId], () => getPriority(), {
        cacheTime: 0,
        enabled,
    });
};
exports.usePriorityInfo = usePriorityInfo;
