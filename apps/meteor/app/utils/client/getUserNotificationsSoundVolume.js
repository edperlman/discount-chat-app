"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNotificationsSoundVolume = void 0;
const getUserPreference_1 = require("./lib/getUserPreference");
const getUserNotificationsSoundVolume = (userId) => {
    const masterVolume = (0, getUserPreference_1.getUserPreference)(userId, 'masterVolume', 100);
    const notificationsSoundVolume = (0, getUserPreference_1.getUserPreference)(userId, 'notificationsSoundVolume', 100);
    return (notificationsSoundVolume * masterVolume) / 100;
};
exports.getUserNotificationsSoundVolume = getUserNotificationsSoundVolume;
