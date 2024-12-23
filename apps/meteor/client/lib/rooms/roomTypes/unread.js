"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnreadRoomType = void 0;
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../../app/utils/client");
const unread_1 = require("../../../../lib/rooms/roomTypes/unread");
const roomCoordinator_1 = require("../roomCoordinator");
exports.UnreadRoomType = (0, unread_1.getUnreadRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(Object.assign(Object.assign({}, exports.UnreadRoomType), { label: 'Unread' }), {
    condition() {
        return (0, client_1.getUserPreference)(meteor_1.Meteor.userId(), 'sidebarShowUnread');
    },
});
