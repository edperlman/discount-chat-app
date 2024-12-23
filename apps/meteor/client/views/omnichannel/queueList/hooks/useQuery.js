"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = void 0;
const react_1 = require("react");
const sortDir = (sortDir) => (sortDir === 'asc' ? 1 : -1);
const useQuery = ({ servedBy, status, departmentId, itemsPerPage, current }, [column, direction]) => (0, react_1.useMemo)(() => {
    const query = {
        sort: JSON.stringify({
            [column]: sortDir(direction),
        }),
        count: itemsPerPage,
        offset: current,
    };
    if (status !== 'online') {
        query.includeOfflineAgents = 'true';
    }
    if (servedBy) {
        query.agentId = servedBy;
    }
    if (departmentId) {
        query.departmentId = departmentId;
    }
    return query;
}, [column, direction, itemsPerPage, current, status, servedBy, departmentId]);
exports.useQuery = useQuery;
