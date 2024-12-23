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
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
meteor_1.Meteor.methods({
    'autoTranslate.saveSettings'(rid, field, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'saveAutoTranslateSettings',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'auto-translate'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Auto-Translate is not allowed', {
                    method: 'autoTranslate.saveSettings',
                });
            }
            (0, check_1.check)(rid, String);
            (0, check_1.check)(field, String);
            (0, check_1.check)(value, String);
            if (['autoTranslate', 'autoTranslateLanguage'].indexOf(field) === -1) {
                throw new meteor_1.Meteor.Error('error-invalid-settings', 'Invalid settings field', {
                    method: 'saveAutoTranslateSettings',
                });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, userId);
            if (!subscription) {
                throw new meteor_1.Meteor.Error('error-invalid-subscription', 'Invalid subscription', {
                    method: 'saveAutoTranslateSettings',
                });
            }
            let shouldNotifySubscriptionChanged = false;
            switch (field) {
                case 'autoTranslate':
                    const room = yield models_1.Rooms.findE2ERoomById(rid, { projection: { _id: 1 } });
                    if (room && value === '1') {
                        throw new meteor_1.Meteor.Error('error-e2e-enabled', 'Enabling auto-translation in E2E encrypted rooms is not allowed', {
                            method: 'saveAutoTranslateSettings',
                        });
                    }
                    const updateAutoTranslateResponse = yield models_1.Subscriptions.updateAutoTranslateById(subscription._id, value === '1');
                    if (updateAutoTranslateResponse.modifiedCount) {
                        shouldNotifySubscriptionChanged = true;
                    }
                    if (!subscription.autoTranslateLanguage && options.defaultLanguage) {
                        const updateAutoTranslateLanguageResponse = yield models_1.Subscriptions.updateAutoTranslateLanguageById(subscription._id, options.defaultLanguage);
                        if (updateAutoTranslateLanguageResponse.modifiedCount) {
                            shouldNotifySubscriptionChanged = true;
                        }
                    }
                    break;
                case 'autoTranslateLanguage':
                    const updateAutoTranslateLanguage = yield models_1.Subscriptions.updateAutoTranslateLanguageById(subscription._id, value);
                    if (updateAutoTranslateLanguage.modifiedCount) {
                        shouldNotifySubscriptionChanged = true;
                    }
                    break;
            }
            if (shouldNotifySubscriptionChanged) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedById)(subscription._id);
            }
            return true;
        });
    },
});
