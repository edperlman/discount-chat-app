"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTeamsListChildrenUpdate = void 0;
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const client_1 = require("../../../../../app/models/client");
const useSortQueryOptions_1 = require("../../../../hooks/useSortQueryOptions");
const useTeamsListChildrenUpdate = (parentRid, teamId, sidepanelItems) => {
    const options = (0, useSortQueryOptions_1.useSortQueryOptions)();
    const query = (0, react_1.useMemo)(() => {
        const query = {
            $or: [
                {
                    _id: parentRid,
                },
            ],
        };
        if ((!sidepanelItems || sidepanelItems === 'discussions') && query.$or) {
            query.$or.push({
                prid: parentRid,
            });
        }
        if ((!sidepanelItems || sidepanelItems === 'channels') && teamId && query.$or) {
            query.$or.push({
                teamId,
            });
        }
        return query;
    }, [parentRid, teamId, sidepanelItems]);
    const result = (0, react_query_1.useQuery)({
        queryKey: ['sidepanel', 'list', parentRid, sidepanelItems, options],
        queryFn: () => client_1.Rooms.find(query, options).fetch(),
        enabled: sidepanelItems !== null && teamId !== null,
        refetchInterval: 5 * 60 * 1000,
        keepPreviousData: true,
    });
    const { refetch } = result;
    (0, react_1.useEffect)(() => {
        const liveQueryHandle = client_1.Rooms.find(query).observe({
            added: () => queueMicrotask(() => refetch({ exact: false })),
            changed: () => queueMicrotask(() => refetch({ exact: false })),
            removed: () => queueMicrotask(() => refetch({ exact: false })),
        });
        return () => {
            liveQueryHandle.stop();
        };
    }, [query, refetch]);
    return result;
};
exports.useTeamsListChildrenUpdate = useTeamsListChildrenUpdate;
