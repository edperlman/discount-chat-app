"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultSubscriptionPref = void 0;
/**
 * @type {(userPref: Pick<import('@rocket.chat/core-typings').IUser, 'settings'>) => {
 * 	desktopPrefOrigin: 'user';
 * 	mobilePrefOrigin: 'user';
 * 	emailPrefOrigin: 'user';
 * }}
 */
const getDefaultSubscriptionPref = (userPref) => {
    var _a;
    const subscription = {};
    const { desktopNotifications, pushNotifications, emailNotificationMode, highlights } = ((_a = userPref.settings) === null || _a === void 0 ? void 0 : _a.preferences) || {};
    if (Array.isArray(highlights) && highlights.length) {
        subscription.userHighlights = highlights;
    }
    if (desktopNotifications && desktopNotifications !== 'default') {
        subscription.desktopNotifications = desktopNotifications;
        subscription.desktopPrefOrigin = 'user';
    }
    if (pushNotifications && pushNotifications !== 'default') {
        subscription.mobilePushNotifications = pushNotifications;
        subscription.mobilePrefOrigin = 'user';
    }
    if (emailNotificationMode && emailNotificationMode !== 'default') {
        subscription.emailNotifications = emailNotificationMode;
        subscription.emailPrefOrigin = 'user';
    }
    return subscription;
};
exports.getDefaultSubscriptionPref = getDefaultSubscriptionPref;
