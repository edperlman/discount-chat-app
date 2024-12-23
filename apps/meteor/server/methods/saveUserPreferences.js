"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserPreferences = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const server_1 = require("../../app/settings/server");
function updateNotificationPreferences(userId, setting, newValue, oldValue, preferenceType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newValue === oldValue) {
            return;
        }
        if (newValue === 'default') {
            const clearNotificationResponse = yield models_1.Subscriptions.clearNotificationUserPreferences(userId, setting, preferenceType);
            if (clearNotificationResponse.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByUserPreferences)(userId, preferenceType, 'user');
            }
            return;
        }
        const updateNotificationResponse = yield models_1.Subscriptions.updateNotificationUserPreferences(userId, newValue, setting, preferenceType);
        if (updateNotificationResponse.modifiedCount) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedByUserPreferences)(userId, preferenceType, 'subscription');
        }
    });
}
const saveUserPreferences = (settings, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const keys = {
        language: check_1.Match.Optional(String),
        newRoomNotification: check_1.Match.Optional(String),
        newMessageNotification: check_1.Match.Optional(String),
        clockMode: check_1.Match.Optional(Number),
        useEmojis: check_1.Match.Optional(Boolean),
        convertAsciiEmoji: check_1.Match.Optional(Boolean),
        saveMobileBandwidth: check_1.Match.Optional(Boolean),
        collapseMediaByDefault: check_1.Match.Optional(Boolean),
        autoImageLoad: check_1.Match.Optional(Boolean),
        emailNotificationMode: check_1.Match.Optional(String),
        unreadAlert: check_1.Match.Optional(Boolean),
        masterVolume: check_1.Match.Optional(Number),
        notificationsSoundVolume: check_1.Match.Optional(Number),
        voipRingerVolume: check_1.Match.Optional(Number),
        desktopNotifications: check_1.Match.Optional(String),
        pushNotifications: check_1.Match.Optional(String),
        enableAutoAway: check_1.Match.Optional(Boolean),
        highlights: check_1.Match.Optional([String]),
        hideUsernames: check_1.Match.Optional(Boolean),
        hideRoles: check_1.Match.Optional(Boolean),
        displayAvatars: check_1.Match.Optional(Boolean),
        hideFlexTab: check_1.Match.Optional(Boolean),
        sendOnEnter: check_1.Match.Optional(String),
        idleTimeLimit: check_1.Match.Optional(Number),
        sidebarShowFavorites: check_1.Match.Optional(Boolean),
        sidebarShowUnread: check_1.Match.Optional(Boolean),
        sidebarSortby: check_1.Match.Optional(String),
        sidebarViewMode: check_1.Match.Optional(String),
        sidebarDisplayAvatar: check_1.Match.Optional(Boolean),
        sidebarGroupByType: check_1.Match.Optional(Boolean),
        muteFocusedConversations: check_1.Match.Optional(Boolean),
        themeAppearence: check_1.Match.Optional(String),
        fontSize: check_1.Match.Optional(String),
        omnichannelTranscriptEmail: check_1.Match.Optional(Boolean),
        omnichannelTranscriptPDF: check_1.Match.Optional(Boolean),
        omnichannelHideConversationAfterClosing: check_1.Match.Optional(Boolean),
        notifyCalendarEvents: check_1.Match.Optional(Boolean),
        enableMobileRinging: check_1.Match.Optional(Boolean),
        mentionsWithSymbol: check_1.Match.Optional(Boolean),
    };
    (0, check_1.check)(settings, check_1.Match.ObjectIncluding(keys));
    const user = yield models_1.Users.findOneById(userId);
    if (!user) {
        return;
    }
    const { desktopNotifications: oldDesktopNotifications, pushNotifications: oldMobileNotifications, emailNotificationMode: oldEmailNotifications, language: oldLanguage, } = ((_a = user.settings) === null || _a === void 0 ? void 0 : _a.preferences) || {};
    if (user.settings == null) {
        yield models_1.Users.clearSettings(user._id);
    }
    if (settings.language != null) {
        yield models_1.Users.setLanguage(user._id, settings.language);
    }
    // Keep compatibility with old values
    if (settings.emailNotificationMode === 'all') {
        settings.emailNotificationMode = 'mentions';
    }
    else if (settings.emailNotificationMode === 'disabled') {
        settings.emailNotificationMode = 'nothing';
    }
    if (settings.idleTimeLimit != null && settings.idleTimeLimit < 60) {
        throw new meteor_1.Meteor.Error('invalid-idle-time-limit-value', 'Invalid idleTimeLimit');
    }
    yield models_1.Users.setPreferences(user._id, settings);
    const diff = Object.keys(settings).reduce((data, key) => {
        data[`settings.preferences.${key}`] = settings[key];
        return data;
    }, {});
    void (0, notifyListener_1.notifyOnUserChange)({
        id: user._id,
        clientAction: 'updated',
        diff: Object.assign(Object.assign({}, diff), (settings.language != null && { language: settings.language })),
    });
    // propagate changed notification preferences
    setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
        const { desktopNotifications, pushNotifications, emailNotificationMode, highlights, language } = settings;
        const promises = [];
        if (desktopNotifications) {
            promises.push(updateNotificationPreferences(user._id, 'desktopNotifications', desktopNotifications, oldDesktopNotifications, 'desktopPrefOrigin'));
        }
        if (pushNotifications) {
            promises.push(updateNotificationPreferences(user._id, 'mobilePushNotifications', pushNotifications, oldMobileNotifications, 'mobilePrefOrigin'));
        }
        if (emailNotificationMode) {
            promises.push(updateNotificationPreferences(user._id, 'emailNotifications', emailNotificationMode, oldEmailNotifications, 'emailPrefOrigin'));
        }
        yield Promise.allSettled(promises);
        if (Array.isArray(highlights)) {
            const response = yield models_1.Subscriptions.updateUserHighlights(user._id, highlights);
            if (response.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByUserId)(user._id);
            }
        }
        if (language && oldLanguage !== language && server_1.settings.get('AutoTranslate_AutoEnableOnJoinRoom')) {
            const response = yield models_1.Subscriptions.updateAllAutoTranslateLanguagesByUserId(user._id, language);
            if (response.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByAutoTranslateAndUserId)(user._id);
            }
        }
    }));
});
exports.saveUserPreferences = saveUserPreferences;
meteor_1.Meteor.methods({
    saveUserPreferences(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'saveUserPreferences' });
            }
            yield (0, exports.saveUserPreferences)(settings, userId);
            return true;
        });
    },
});
