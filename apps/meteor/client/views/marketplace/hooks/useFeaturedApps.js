"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFeaturedApps = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useFeaturedApps = () => {
    const featuredApps = (0, ui_contexts_1.useEndpoint)('GET', '/apps/featured-apps');
    return (0, react_query_1.useQuery)({
        queryKey: ['featured-apps'],
        queryFn: () => featuredApps(),
    });
};
exports.useFeaturedApps = useFeaturedApps;
