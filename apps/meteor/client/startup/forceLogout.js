"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const session_1 = require("meteor/session");
const tracker_1 = require("meteor/tracker");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const userId = meteor_1.Meteor.userId();
        if (!userId) {
            return;
        }
        session_1.Session.set('force_logout', false);
        SDKClient_1.sdk.stream('notify-user', [`${userId}/force_logout`], () => {
            session_1.Session.set('force_logout', true);
        });
    });
});
