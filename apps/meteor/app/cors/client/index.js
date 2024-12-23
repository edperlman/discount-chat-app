"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../settings/client");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        meteor_1.Meteor.absoluteUrl.defaultOptions.secure = Boolean(client_1.settings.get('Force_SSL'));
    });
});
