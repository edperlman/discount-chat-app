"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conversation_1 = require("../../../../lib/rooms/roomTypes/conversation");
const roomCoordinator_1 = require("../roomCoordinator");
const ConversationRoomType = (0, conversation_1.getConversationRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(ConversationRoomType, {});
