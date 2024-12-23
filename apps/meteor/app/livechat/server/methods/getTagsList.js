"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
meteor_1.Meteor.methods({
    'livechat:getTagsList'() {
        deprecationWarningLogger_1.methodDeprecationLogger.method('livechat:getTagsList', '7.0.0');
        if (!meteor_1.Meteor.userId()) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'livechat:getTagsList',
            });
        }
        return callbacks_1.callbacks.run('livechat.beforeListTags');
    },
});
