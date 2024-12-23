"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentChats = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useCurrentChats = (query) => {
    const currentChats = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/rooms');
    const debouncedQuery = (0, fuselage_hooks_1.useDebouncedValue)(query, 500);
    return (0, react_query_1.useQuery)(['current-chats', debouncedQuery], () => currentChats(debouncedQuery), {
        // TODO: Update this to use an stream of room changes instead of polling
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });
};
exports.useCurrentChats = useCurrentChats;
