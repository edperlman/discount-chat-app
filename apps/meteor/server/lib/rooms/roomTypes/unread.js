"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unread_1 = require("../../../../lib/rooms/roomTypes/unread");
const roomCoordinator_1 = require("../roomCoordinator");
const UnreadRoomType = (0, unread_1.getUnreadRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(UnreadRoomType, {});
