"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const session_1 = require("meteor/session");
const tracker_1 = require("meteor/tracker");
const CustomSounds_1 = require("../../../app/custom-sounds/client/lib/CustomSounds");
const client_1 = require("../../../app/models/client");
const client_2 = require("../../../app/utils/client");
const getUserNotificationsSoundVolume_1 = require("../../../app/utils/client/getUserNotificationsSoundVolume");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const uid = meteor_1.Meteor.userId();
        if (!uid) {
            return;
        }
        const user = client_1.Users.findOne(uid, {
            fields: {
                'settings.preferences.newRoomNotification': 1,
                'settings.preferences.notificationsSoundVolume': 1,
            },
        });
        const newRoomNotification = (0, client_2.getUserPreference)(user, 'newRoomNotification');
        const audioVolume = (0, getUserNotificationsSoundVolume_1.getUserNotificationsSoundVolume)(user === null || user === void 0 ? void 0 : user._id);
        if (!newRoomNotification) {
            return;
        }
        if ((session_1.Session.get('newRoomSound') || []).length > 0) {
            setTimeout(() => {
                if (newRoomNotification !== 'none') {
                    CustomSounds_1.CustomSounds.play(newRoomNotification, {
                        volume: Number((audioVolume / 100).toPrecision(2)),
                    });
                }
            }, 0);
        }
        else {
            CustomSounds_1.CustomSounds.pause(newRoomNotification);
        }
    });
});
