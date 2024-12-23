"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUnpinMessageAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useUnpinMessageMutation_1 = require("../hooks/useUnpinMessageMutation");
const useUnpinMessageAction = (message, { room, subscription }) => {
    const allowPinning = (0, ui_contexts_1.useSetting)('Message_AllowPinning');
    const hasPermission = (0, ui_contexts_1.usePermission)('pin-message', room._id);
    const { mutate: unpinMessage } = (0, useUnpinMessageMutation_1.useUnpinMessageMutation)();
    if (!allowPinning || (0, core_typings_1.isOmnichannelRoom)(room) || !hasPermission || !message.pinned || !subscription) {
        return null;
    }
    return {
        id: 'unpin-message',
        icon: 'pin',
        label: 'Unpin',
        type: 'interaction',
        context: ['pinned', 'message', 'message-mobile', 'threads', 'direct', 'videoconf', 'videoconf-threads'],
        action() {
            unpinMessage(message);
        },
        order: 2,
        group: 'menu',
    };
};
exports.useUnpinMessageAction = useUnpinMessageAction;
