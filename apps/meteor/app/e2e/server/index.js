"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const callbacks_1 = require("../../../lib/callbacks");
require("./beforeCreateRoom");
require("./methods/setUserPublicAndPrivateKeys");
require("./methods/getUsersOfRoomWithoutKey");
require("./methods/updateGroupKey");
require("./methods/setRoomKeyID");
require("./methods/fetchMyKeys");
require("./methods/resetOwnE2EKey");
require("./methods/requestSubscriptionKeys");
callbacks_1.callbacks.add('afterJoinRoom', (_user, room) => {
    void core_services_1.api.broadcast('notify.e2e.keyRequest', room._id, room.e2eKeyId);
}, callbacks_1.callbacks.priority.MEDIUM, 'e2e');
