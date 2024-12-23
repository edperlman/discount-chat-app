"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteRoomType = void 0;
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../../app/settings/client");
const client_2 = require("../../../../app/utils/client");
const favorite_1 = require("../../../../lib/rooms/roomTypes/favorite");
const roomCoordinator_1 = require("../roomCoordinator");
exports.FavoriteRoomType = (0, favorite_1.getFavoriteRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(Object.assign(Object.assign({}, exports.FavoriteRoomType), { label: 'Favorites' }), {
    condition() {
        return client_1.settings.get('Favorite_Rooms') && (0, client_2.getUserPreference)(meteor_1.Meteor.userId(), 'sidebarShowFavorites');
    },
    getIcon() {
        return 'star';
    },
});
