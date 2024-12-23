"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClearRemovedRoomsHistory = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../app/ui-utils/client");
const useClearRemovedRoomsHistory = (userId) => {
    const subscribeToNotifyUser = (0, ui_contexts_1.useStream)('notify-user');
    (0, react_1.useEffect)(() => {
        if (!userId) {
            return;
        }
        return subscribeToNotifyUser(`${userId}/subscriptions-changed`, (event, data) => {
            if (data.t !== 'l' && event === 'removed' && data.rid) {
                client_1.RoomHistoryManager.clear(data.rid);
            }
        });
    }, [userId, subscribeToNotifyUser]);
};
exports.useClearRemovedRoomsHistory = useClearRemovedRoomsHistory;
