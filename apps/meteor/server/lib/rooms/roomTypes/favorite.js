"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const favorite_1 = require("../../../../lib/rooms/roomTypes/favorite");
const roomCoordinator_1 = require("../roomCoordinator");
const FavoriteRoomType = (0, favorite_1.getFavoriteRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(FavoriteRoomType, {});
