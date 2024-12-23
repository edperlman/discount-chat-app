"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoadSurroundingMessages = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const legacyJumpToMessage_1 = require("../../../../lib/utils/legacyJumpToMessage");
const useLoadSurroundingMessages = (msgId) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const getMessage = (0, ui_contexts_1.useEndpoint)('GET', '/v1/chat.getMessage');
    (0, react_1.useEffect)(() => {
        if (!msgId) {
            return;
        }
        const abort = new AbortController();
        queryClient
            .fetchQuery({
            queryKey: ['chat.getMessage', msgId],
            queryFn: () => {
                return getMessage({ msgId });
            },
        })
            .then(({ message }) => {
            if (abort.signal.aborted) {
                return;
            }
            // Serialized IMessage dates are strings. For this function, only ts is needed
            (0, legacyJumpToMessage_1.legacyJumpToMessage)(Object.assign(Object.assign({}, message), { ts: new Date(message.ts) }));
        })
            .catch((error) => {
            console.warn(error);
        });
        return () => {
            abort.abort();
        };
    }, [msgId, queryClient, getMessage]);
};
exports.useLoadSurroundingMessages = useLoadSurroundingMessages;
