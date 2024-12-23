"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
tracker_1.Tracker.autorun(() => {
    const userId = meteor_1.Meteor.userId();
    // Check for Meteor.loggingIn to be reactive and ensure it will process only after login finishes
    // preventing race condition setting the rc_token as null forever
    if (userId && meteor_1.Meteor.loggingIn() === false) {
        const secure = location.protocol === 'https:' ? '; secure' : '';
        document.cookie = `rc_uid=${escape(userId)}; path=/${secure}`;
        document.cookie = `rc_token=${escape(accounts_base_1.Accounts._storedLoginToken())}; path=/${secure}`;
    }
});
