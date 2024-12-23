"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReplyInDMAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../app/models/client");
const useEmbeddedLayout_1 = require("../../../hooks/useEmbeddedLayout");
const useReactiveValue_1 = require("../../../hooks/useReactiveValue");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const useReplyInDMAction = (message, { room, subscription }) => {
    const user = (0, ui_contexts_1.useUser)();
    const router = (0, ui_contexts_1.useRouter)();
    const encrypted = (0, core_typings_1.isE2EEMessage)(message);
    const canCreateDM = (0, ui_contexts_1.usePermission)('create-d');
    const isLayoutEmbedded = (0, useEmbeddedLayout_1.useEmbeddedLayout)();
    const condition = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => {
        if (!subscription || room.t === 'd' || room.t === 'l' || isLayoutEmbedded) {
            return false;
        }
        // Check if we already have a DM started with the message user (not ourselves) or we can start one
        if (!!user && user._id !== message.u._id && !canCreateDM) {
            const dmRoom = client_1.Rooms.findOne({ _id: [user._id, message.u._id].sort().join('') });
            if (!dmRoom || !client_1.Subscriptions.findOne({ 'rid': dmRoom._id, 'u._id': user._id })) {
                return false;
            }
        }
        return true;
    }, [canCreateDM, isLayoutEmbedded, message.u._id, room.t, subscription, user]));
    if (!condition) {
        return null;
    }
    return {
        id: 'reply-directly',
        icon: 'reply-directly',
        label: 'Reply_in_direct_message',
        context: ['message', 'message-mobile', 'threads', 'federated'],
        type: 'communication',
        action() {
            roomCoordinator_1.roomCoordinator.openRouteLink('d', { name: message.u.username }, Object.assign(Object.assign({}, router.getSearchParameters()), { reply: message._id }));
        },
        order: 0,
        group: 'menu',
        disabled: encrypted,
    };
};
exports.useReplyInDMAction = useReplyInDMAction;
