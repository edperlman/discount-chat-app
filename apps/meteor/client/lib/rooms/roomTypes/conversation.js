"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRoomType = void 0;
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../../app/utils/client");
const conversation_1 = require("../../../../lib/rooms/roomTypes/conversation");
const roomCoordinator_1 = require("../roomCoordinator");
exports.ConversationRoomType = (0, conversation_1.getConversationRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(Object.assign(Object.assign({}, exports.ConversationRoomType), { label: 'Conversations' }), {
    condition() {
        // returns true only if sidebarGroupByType is not set
        return !(0, client_1.getUserPreference)(meteor_1.Meteor.userId(), 'sidebarGroupByType');
    },
});
