"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStatistics = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useStatistics = ({ refresh } = { refresh: 'false' }) => {
    const getStatistics = (0, ui_contexts_1.useEndpoint)('GET', '/v1/statistics');
    return (0, react_query_1.useQuery)(['analytics'], () => getStatistics({ refresh }), { staleTime: 10 * 60 * 1000 });
};
exports.useStatistics = useStatistics;
