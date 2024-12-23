"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVideoConfRoomName = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useUserDisplayName_1 = require("../../../../../hooks/useUserDisplayName");
const useVideoConfRoomName = (room) => {
    const subscription = (0, ui_contexts_1.useUserSubscription)(room._id);
    const username = (0, useUserDisplayName_1.useUserDisplayName)({ name: subscription === null || subscription === void 0 ? void 0 : subscription.fname, username: subscription === null || subscription === void 0 ? void 0 : subscription.name });
    return (0, core_typings_1.isDirectMessageRoom)(room) ? username : room.fname || room.name;
};
exports.useVideoConfRoomName = useVideoConfRoomName;
