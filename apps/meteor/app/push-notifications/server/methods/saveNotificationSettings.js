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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const getUserNotificationPreference_1 = require("../../../utils/server/getUserNotificationPreference");
const saveAudioNotificationValue = (subId, value) => value === 'default' ? models_1.Subscriptions.clearAudioNotificationValueById(subId) : models_1.Subscriptions.updateAudioNotificationValueById(subId, value);
meteor_1.Meteor.methods({
    saveNotificationSettings(roomId, field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'saveNotificationSettings',
                });
            }
            (0, check_1.check)(roomId, String);
            (0, check_1.check)(field, String);
            (0, check_1.check)(value, String);
            const getNotificationPrefValue = (field, value) => __awaiter(this, void 0, void 0, function* () {
                if (value === 'default') {
                    const userId = meteor_1.Meteor.userId();
                    if (!userId) {
                        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                            method: 'saveNotificationSettings',
                        });
                    }
                    const userPref = yield (0, getUserNotificationPreference_1.getUserNotificationPreference)(userId, field);
                    return (userPref === null || userPref === void 0 ? void 0 : userPref.origin) === 'server' ? null : userPref;
                }
                return { value, origin: 'subscription' };
            });
            const notifications = {
                desktopNotifications: {
                    updateMethod: (subscription, value) => __awaiter(this, void 0, void 0, function* () {
                        return models_1.Subscriptions.updateNotificationsPrefById(subscription._id, yield getNotificationPrefValue('desktop', value), 'desktopNotifications', 'desktopPrefOrigin');
                    }),
                },
                mobilePushNotifications: {
                    updateMethod: (subscription, value) => __awaiter(this, void 0, void 0, function* () {
                        return models_1.Subscriptions.updateNotificationsPrefById(subscription._id, yield getNotificationPrefValue('mobile', value), 'mobilePushNotifications', 'mobilePrefOrigin');
                    }),
                },
                emailNotifications: {
                    updateMethod: (subscription, value) => __awaiter(this, void 0, void 0, function* () {
                        return models_1.Subscriptions.updateNotificationsPrefById(subscription._id, yield getNotificationPrefValue('email', value), 'emailNotifications', 'emailPrefOrigin');
                    }),
                },
                unreadAlert: {
                    // @ts-expect-error - Check types of model. The way the method is defined makes difficult to type it, check proper types for `value`
                    updateMethod: (subscription, value) => models_1.Subscriptions.updateUnreadAlertById(subscription._id, value),
                },
                disableNotifications: {
                    updateMethod: (subscription, value) => models_1.Subscriptions.updateDisableNotificationsById(subscription._id, value === '1'),
                },
                hideUnreadStatus: {
                    updateMethod: (subscription, value) => models_1.Subscriptions.updateHideUnreadStatusById(subscription._id, value === '1'),
                },
                hideMentionStatus: {
                    updateMethod: (subscription, value) => models_1.Subscriptions.updateHideMentionStatusById(subscription._id, value === '1'),
                },
                muteGroupMentions: {
                    updateMethod: (subscription, value) => models_1.Subscriptions.updateMuteGroupMentions(subscription._id, value === '1'),
                },
                audioNotificationValue: {
                    updateMethod: (subscription, value) => saveAudioNotificationValue(subscription._id, value),
                },
            };
            const isInvalidNotification = !Object.keys(notifications).includes(field);
            const basicValuesForNotifications = ['all', 'mentions', 'nothing', 'default'];
            const fieldsMustHaveBasicValues = ['emailNotifications', 'mobilePushNotifications', 'desktopNotifications'];
            if (isInvalidNotification) {
                throw new meteor_1.Meteor.Error('error-invalid-settings', 'Invalid settings field', {
                    method: 'saveNotificationSettings',
                });
            }
            if (fieldsMustHaveBasicValues.includes(field) && !basicValuesForNotifications.includes(value)) {
                throw new meteor_1.Meteor.Error('error-invalid-settings', 'Invalid settings value', {
                    method: 'saveNotificationSettings',
                });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, userId);
            if (!subscription) {
                throw new meteor_1.Meteor.Error('error-invalid-subscription', 'Invalid subscription', {
                    method: 'saveNotificationSettings',
                });
            }
            const updateResponse = yield notifications[field].updateMethod(subscription, value);
            if (updateResponse.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedById)(subscription._id);
            }
            return true;
        });
    },
    saveAudioNotificationValue(rid, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'saveAudioNotificationValue',
                });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, userId);
            if (!subscription) {
                throw new meteor_1.Meteor.Error('error-invalid-subscription', 'Invalid subscription', {
                    method: 'saveAudioNotificationValue',
                });
            }
            const saveAudioNotificationResponse = yield saveAudioNotificationValue(subscription._id, value);
            if (saveAudioNotificationResponse.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedById)(subscription._id);
            }
            return true;
        });
    },
});
