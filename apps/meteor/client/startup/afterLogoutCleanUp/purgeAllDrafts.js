"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../lib/callbacks");
const afterLogoutCleanUpCallback_1 = require("../../../lib/callbacks/afterLogoutCleanUpCallback");
meteor_1.Meteor.startup(() => {
    const purgeAllDrafts = () => {
        Object.keys(localStorage)
            .filter((key) => key.indexOf('messagebox_') === 0)
            .forEach((key) => localStorage.removeItem(key));
    };
    afterLogoutCleanUpCallback_1.afterLogoutCleanUpCallback.add(purgeAllDrafts, callbacks_1.callbacks.priority.MEDIUM, 'chatMessages-after-logout-cleanup');
});
