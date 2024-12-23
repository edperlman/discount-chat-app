"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavoriteRoom = void 0;
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../app/models/client");
const toggleFavoriteRoom = (roomId, favorite) => {
    const userId = meteor_1.Meteor.userId();
    client_1.Subscriptions.update({
        'rid': roomId,
        'u._id': userId,
    }, {
        $set: {
            f: favorite,
        },
    });
};
exports.toggleFavoriteRoom = toggleFavoriteRoom;
