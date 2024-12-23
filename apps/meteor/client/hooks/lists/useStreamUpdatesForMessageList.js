"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStreamUpdatesForMessageList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const minimongo_1 = require("../../lib/minimongo");
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
const useStreamUpdatesForMessageList = (messageList, uid, rid) => {
    const subscribeToRoomMessages = (0, ui_contexts_1.useStream)('room-messages');
    const subscribeToNotifyRoom = (0, ui_contexts_1.useStream)('notify-room');
    (0, react_1.useEffect)(() => {
        if (!uid || !rid) {
            messageList.clear();
            return;
        }
        const unsubscribeFromRoomMessages = subscribeToRoomMessages(rid, (message) => {
            messageList.handle(message);
        });
        const unsubscribeFromDeleteMessage = subscribeToNotifyRoom(`${rid}/deleteMessage`, ({ _id: mid }) => {
            messageList.remove(mid);
        });
        const unsubscribeFromDeleteMessageBulk = subscribeToNotifyRoom(`${rid}/deleteMessageBulk`, (params) => {
            const matchDeleteCriteria = createDeleteCriteria(params);
            messageList.prune(matchDeleteCriteria);
        });
        return () => {
            unsubscribeFromRoomMessages();
            unsubscribeFromDeleteMessage();
            unsubscribeFromDeleteMessageBulk();
        };
    }, [subscribeToRoomMessages, subscribeToNotifyRoom, uid, rid, messageList]);
};
exports.useStreamUpdatesForMessageList = useStreamUpdatesForMessageList;
