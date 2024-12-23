"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFollowMessageAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const client_1 = require("../../../../app/models/client");
const i18n_1 = require("../../../../app/utils/lib/i18n");
const useReactiveQuery_1 = require("../../../hooks/useReactiveQuery");
const queryKeys_1 = require("../../../lib/queryKeys");
const useToggleFollowingThreadMutation_1 = require("../../../views/room/contextualBar/Threads/hooks/useToggleFollowingThreadMutation");
const useFollowMessageAction = (message, { room, context }) => {
    const user = (0, ui_contexts_1.useUser)();
    const threadsEnabled = (0, ui_contexts_1.useSetting)('Threads_enabled');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { mutate: toggleFollowingThread } = (0, useToggleFollowingThreadMutation_1.useToggleFollowingThreadMutation)({
        onSuccess: () => {
            dispatchToastMessage({
                type: 'success',
                message: (0, i18n_1.t)('You_followed_this_message'),
            });
        },
    });
    const { tmid, _id } = message;
    const messageQuery = (0, useReactiveQuery_1.useReactiveQuery)(queryKeys_1.roomsQueryKeys.message(message.rid, message._id), () => client_1.Messages.findOne({ _id: tmid || _id }, { fields: { replies: 1 } }));
    if (!message || !threadsEnabled || (0, core_typings_1.isOmnichannelRoom)(room)) {
        return null;
    }
    let { replies = [] } = message;
    if (tmid || context) {
        const parentMessage = messageQuery.data;
        if (parentMessage) {
            replies = parentMessage.replies || [];
        }
    }
    if (!(user === null || user === void 0 ? void 0 : user._id)) {
        return null;
    }
    if (replies.includes(user._id)) {
        return null;
    }
    return {
        id: 'follow-message',
        icon: 'bell',
        label: 'Follow_message',
        type: 'interaction',
        context: ['message', 'message-mobile', 'threads', 'federated', 'videoconf', 'videoconf-threads'],
        action() {
            toggleFollowingThread({ tmid: tmid || _id, follow: true, rid: room._id });
        },
        order: 1,
        group: 'menu',
    };
};
exports.useFollowMessageAction = useFollowMessageAction;
