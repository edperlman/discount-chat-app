"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message, { room, roomUpdater }) => {
    // skips this callback if the message was edited
    if (!message || (0, core_typings_1.isEditedMessage)(message)) {
        return message;
    }
    // if the message has not a token, it was sent by the agent, so ignore it
    if (!message.token) {
        return message;
    }
    // check if room is yet awaiting for response
    if (room.waitingResponse) {
        return message;
    }
    models_1.LivechatRooms.getNotResponseByRoomIdUpdateQuery(roomUpdater);
    return message;
}, callbacks_1.callbacks.priority.LOW, 'markRoomNotResponded');
