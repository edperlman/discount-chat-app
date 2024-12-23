"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
meteor_1.Meteor.methods({
    sendSystemMessages() {
        if (!meteor_1.Meteor.userId()) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'sendSystemMessages' });
        }
        // deprecated, use REST /v1/chat.otr instead
    },
});
