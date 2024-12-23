"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomInfoEndpoint = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const date_fns_1 = require("date-fns");
const useRoomInfoEndpoint = (rid) => {
    const getRoomInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/rooms.info');
    const uid = (0, ui_contexts_1.useUserId)();
    return (0, react_query_1.useQuery)(['/v1/rooms.info', rid], () => getRoomInfo({ roomId: rid }), {
        cacheTime: (0, date_fns_1.minutesToMilliseconds)(15),
        staleTime: (0, date_fns_1.minutesToMilliseconds)(5),
        retry: (count, error) => {
            if (count > 2 || error.error === 'not-allowed') {
                return false;
            }
            return true;
        },
        enabled: !!uid,
    });
};
exports.useRoomInfoEndpoint = useRoomInfoEndpoint;
