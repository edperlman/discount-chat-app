"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogs = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useLogs = (appId) => {
    const logs = (0, ui_contexts_1.useEndpoint)('GET', '/apps/:id/logs', { id: appId });
    return (0, react_query_1.useQuery)(['marketplace', 'apps', appId, 'logs'], () => logs());
};
exports.useLogs = useLogs;
