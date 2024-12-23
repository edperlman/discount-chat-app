"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../app/ui-utils/client");
const callbacks_1 = require("../../../lib/callbacks");
const afterLogoutCleanUpCallback_1 = require("../../../lib/callbacks/afterLogoutCleanUpCallback");
meteor_1.Meteor.startup(() => {
    afterLogoutCleanUpCallback_1.afterLogoutCleanUpCallback.add(() => client_1.LegacyRoomManager.closeAllRooms(), callbacks_1.callbacks.priority.MEDIUM, 'roommanager-after-logout-cleanup');
});
