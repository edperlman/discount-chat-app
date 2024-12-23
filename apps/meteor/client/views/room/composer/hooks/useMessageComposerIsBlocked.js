"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageComposerIsBlocked = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const RoomContext_1 = require("../../contexts/RoomContext");
const useMessageComposerIsBlocked = ({ subscription }) => {
    const room = (0, RoomContext_1.useRoom)();
    if (!(0, core_typings_1.isDirectMessageRoom)(room)) {
        return false;
    }
    if (!subscription) {
        return false;
    }
    // over DM's is possible to block or being blocked by the other user
    const isBlocked = Boolean(subscription.blocked);
    const isBlocker = Boolean(subscription.blocker);
    return isBlocked || isBlocker;
};
exports.useMessageComposerIsBlocked = useMessageComposerIsBlocked;
