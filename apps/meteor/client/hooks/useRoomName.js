"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomName = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useUserDisplayName_1 = require("./useUserDisplayName");
/**
 *
 * Hook to get the name of the room
 *
 * @param room - Room object
 * @returns Room name
 * @public
 *
 */
const useRoomName = (room) => {
    const subscription = (0, ui_contexts_1.useUserSubscription)(room._id);
    const username = (0, useUserDisplayName_1.useUserDisplayName)({ name: subscription === null || subscription === void 0 ? void 0 : subscription.fname, username: subscription === null || subscription === void 0 ? void 0 : subscription.name });
    if ((0, core_typings_1.isDirectMessageRoom)(room)) {
        return username;
    }
    return room.fname || room.name;
};
exports.useRoomName = useRoomName;
