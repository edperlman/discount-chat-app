"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipRoom = exports.useOmnichannelRoom = exports.useRoomMessages = exports.useRoomSubscription = exports.useRoom = exports.useUserIsSubscribed = exports.RoomContext = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = require("react");
exports.RoomContext = (0, react_1.createContext)(null);
const useUserIsSubscribed = () => {
    const context = (0, react_1.useContext)(exports.RoomContext);
    if (!context) {
        throw new Error('use useRoom only inside opened rooms');
    }
    return !!context.subscription;
};
exports.useUserIsSubscribed = useUserIsSubscribed;
const useRoom = () => {
    const context = (0, react_1.useContext)(exports.RoomContext);
    if (!context) {
        throw new Error('use useRoom only inside opened rooms');
    }
    return context.room;
};
exports.useRoom = useRoom;
const useRoomSubscription = () => {
    const context = (0, react_1.useContext)(exports.RoomContext);
    if (!context) {
        throw new Error('use useRoomSubscription only inside opened rooms');
    }
    return context.subscription;
};
exports.useRoomSubscription = useRoomSubscription;
const useRoomMessages = () => {
    const context = (0, react_1.useContext)(exports.RoomContext);
    if (!context) {
        throw new Error('use useRoomMessages only inside opened rooms');
    }
    return {
        hasMorePreviousMessages: context.hasMorePreviousMessages,
        hasMoreNextMessages: context.hasMoreNextMessages,
        isLoadingMoreMessages: context.isLoadingMoreMessages,
    };
};
exports.useRoomMessages = useRoomMessages;
const useOmnichannelRoom = () => {
    // TODO: today if the user do not belong in the room, the room object will not update on new changes
    // for normal rooms this is OK, but for Omnichannel rooms,
    // there are cases where an agent can be outside of the room but need to see the room changes
    // A solution would be to use subscribeToRoom to get the room updates
    const { room } = (0, react_1.useContext)(exports.RoomContext) || {};
    if (!room) {
        throw new Error('use useRoom only inside opened rooms');
    }
    if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
        throw new Error('invalid room type');
    }
    return room;
};
exports.useOmnichannelRoom = useOmnichannelRoom;
const useVoipRoom = () => {
    const { room } = (0, react_1.useContext)(exports.RoomContext) || {};
    if (!room) {
        throw new Error('use useRoom only inside opened rooms');
    }
    if (!(0, core_typings_1.isVoipRoom)(room)) {
        throw new Error('invalid room type');
    }
    return room;
};
exports.useVoipRoom = useVoipRoom;
