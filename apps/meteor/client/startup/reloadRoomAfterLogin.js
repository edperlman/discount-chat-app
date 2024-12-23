"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../app/ui-utils/client");
const roomCoordinator_1 = require("../lib/rooms/roomCoordinator");
const RouterProvider_1 = require("../providers/RouterProvider");
meteor_1.Meteor.startup(() => {
    // Reload rooms after login
    let currentUsername = undefined;
    tracker_1.Tracker.autorun(() => {
        const user = meteor_1.Meteor.user();
        if (currentUsername === undefined && (user ? user.username : undefined)) {
            currentUsername = user === null || user === void 0 ? void 0 : user.username;
            client_1.LegacyRoomManager.closeAllRooms();
            // Reload only if the current route is a channel route
            const routeName = RouterProvider_1.router.getRouteName();
            if (!routeName) {
                return;
            }
            const roomType = roomCoordinator_1.roomCoordinator.getRouteNameIdentifier(routeName);
            if (roomType) {
                RouterProvider_1.router; // TODO: fix this
                // router.navigate(0);
            }
        }
    });
});
