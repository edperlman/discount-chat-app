"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const meteor_1 = require("meteor/meteor");
meteor_1.Meteor.methods({
    'UserPresence:setDefaultStatus'(status) {
        const { userId } = this;
        if (!userId) {
            return;
        }
        return core_services_1.Presence.setStatus(userId, status);
    },
    'UserPresence:online'() {
        const { userId, connection } = this;
        if (!userId || !connection) {
            return;
        }
        return core_services_1.Presence.setConnectionStatus(userId, core_typings_1.UserStatus.ONLINE, connection.id);
    },
    'UserPresence:away'() {
        const { userId, connection } = this;
        if (!userId || !connection) {
            return;
        }
        return core_services_1.Presence.setConnectionStatus(userId, core_typings_1.UserStatus.AWAY, connection.id);
    },
});
