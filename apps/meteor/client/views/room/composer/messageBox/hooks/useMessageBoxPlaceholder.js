"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageBoxPlaceholder = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const useRoomName_1 = require("../../../../../hooks/useRoomName");
const useMessageBoxPlaceholder = (placeholder, room) => {
    if (!room) {
        throw new Error('In order to get the placeholder a `room` must be provided');
    }
    const roomName = (0, useRoomName_1.useRoomName)(room);
    if ((0, core_typings_1.isDirectMessageRoom)(room)) {
        return `${placeholder} @${roomName}`;
    }
    return `${placeholder} #${roomName}`;
};
exports.useMessageBoxPlaceholder = useMessageBoxPlaceholder;
