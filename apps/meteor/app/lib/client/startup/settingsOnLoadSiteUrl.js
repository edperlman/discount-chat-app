"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../../settings/client");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const value = client_1.settings.get('Site_Url');
        if (value == null || value.trim() === '') {
            return;
        }
        window.__meteor_runtime_config__.ROOT_URL = value;
    });
});
