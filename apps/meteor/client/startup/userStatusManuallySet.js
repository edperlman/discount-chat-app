"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../lib/callbacks");
const fireGlobalEvent_1 = require("../lib/utils/fireGlobalEvent");
/* fire user state change globally, to listen on desktop electron client */
meteor_1.Meteor.startup(() => {
    callbacks_1.callbacks.add('userStatusManuallySet', (status) => {
        (0, fireGlobalEvent_1.fireGlobalEvent)('user-status-manually-set', status);
    });
});
