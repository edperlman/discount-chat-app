"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
meteor_1.Meteor.methods({
    getTotalChannels() {
        if (!meteor_1.Meteor.userId()) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'getTotalChannels',
            });
        }
        return models_1.Rooms.col.countDocuments({ t: 'c' });
    },
});
