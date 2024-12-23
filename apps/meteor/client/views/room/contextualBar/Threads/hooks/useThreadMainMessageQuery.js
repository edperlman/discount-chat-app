"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThreadMainMessageQuery = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const useGetMessageByID_1 = require("./useGetMessageByID");
const highOrderFunctions_1 = require("../../../../../../lib/utils/highOrderFunctions");
const minimongo_1 = require("../../../../../lib/minimongo");
const onClientMessageReceived_1 = require("../../../../../lib/onClientMessageReceived");
const RoomContext_1 = require("../../../contexts/RoomContext");
const createDeleteCriteria = (params) => {
    var _a;
    const query = {};
    if (params.ids) {
        query._id = { $in: params.ids };
    }
    else {
        query.ts = params.ts;
    }
    if (params.excludePinned) {
        query.pinned = { $ne: true };
    }
    if (params.ignoreDiscussion) {
        query.drid = { $exists: false };
    }
    if ((_a = params.users) === null || _a === void 0 ? void 0 : _a.length) {
        query['u.username'] = { $in: params.users };
    }
    return (0, minimongo_1.createFilterFromQuery)(query);
};
const useSubscribeToMessage = () => {
    const subscribeToRoomMessages = (0, ui_contexts_1.useStream)('room-messages');
    const subscribeToNotifyRoom = (0, ui_contexts_1.useStream)('notify-room');
    return (0, react_1.useCallback)((message, { onMutate, onDelete }) => {
        const unsubscribeFromRoomMessages = subscribeToRoomMessages(message.rid, (event) => {
            if (message._id === event._id)
                onMutate === null || onMutate === void 0 ? void 0 : onMutate(event);
        });
        const unsubscribeFromDeleteMessage = subscribeToNotifyRoom(`${message.rid}/deleteMessage`, (event) => {
            if (message._id === event._id)
                onDelete === null || onDelete === void 0 ? void 0 : onDelete();
        });
        const unsubscribeFromDeleteMessageBulk = subscribeToNotifyRoom(`${message.rid}/deleteMessageBulk`, (params) => {
            const matchDeleteCriteria = createDeleteCriteria(params);
            if (matchDeleteCriteria(message))
                onDelete === null || onDelete === void 0 ? void 0 : onDelete();
        });
        return () => {
            unsubscribeFromRoomMessages();
            unsubscribeFromDeleteMessage();
            unsubscribeFromDeleteMessageBulk();
        };
    }, [subscribeToNotifyRoom, subscribeToRoomMessages]);
};
const useThreadMainMessageQuery = (tmid, { onDelete } = {}) => {
    const room = (0, RoomContext_1.useRoom)();
    const getMessage = (0, useGetMessageByID_1.useGetMessageByID)();
    const subscribeToMessage = useSubscribeToMessage();
    const queryClient = (0, react_query_1.useQueryClient)();
    const unsubscribeRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        return () => {
            var _a;
            (_a = unsubscribeRef.current) === null || _a === void 0 ? void 0 : _a.call(unsubscribeRef);
            unsubscribeRef.current = undefined;
        };
    }, [tmid]);
    return (0, react_query_1.useQuery)(['rooms', room._id, 'threads', tmid, 'main-message'], (_a) => __awaiter(void 0, [_a], void 0, function* ({ queryKey }) {
        const mainMessage = yield getMessage(tmid);
        if (!mainMessage) {
            throw new Error('Invalid main message');
        }
        const debouncedInvalidate = (0, highOrderFunctions_1.withDebouncing)({ wait: 10000 })(() => {
            queryClient.invalidateQueries(queryKey, { exact: true });
        });
        unsubscribeRef.current =
            unsubscribeRef.current ||
                subscribeToMessage(mainMessage, {
                    onMutate: (message) => __awaiter(void 0, void 0, void 0, function* () {
                        const msg = yield (0, onClientMessageReceived_1.onClientMessageReceived)(message);
                        queryClient.setQueryData(queryKey, () => msg);
                        debouncedInvalidate();
                    }),
                    onDelete: () => {
                        onDelete === null || onDelete === void 0 ? void 0 : onDelete();
                        queryClient.invalidateQueries(queryKey, { exact: true });
                    },
                });
        return mainMessage;
    }));
};
exports.useThreadMainMessageQuery = useThreadMainMessageQuery;
