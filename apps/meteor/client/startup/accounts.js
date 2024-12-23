"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
// import { settings } from '../../app/settings/client';
const client_1 = require("../../app/ui-utils/client");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const i18n_1 = require("../../app/utils/lib/i18n");
const toast_1 = require("../lib/toast");
accounts_base_1.Accounts.onEmailVerificationLink((token) => {
    accounts_base_1.Accounts.verifyEmail(token, (error) => {
        tracker_1.Tracker.autorun(() => {
            if (client_1.mainReady.get()) {
                if (error) {
                    (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
                    throw new meteor_1.Meteor.Error('verify-email', 'E-mail not verified');
                }
                else {
                    tracker_1.Tracker.nonreactive(() => {
                        void SDKClient_1.sdk.call('afterVerifyEmail');
                    });
                    (0, toast_1.dispatchToastMessage)({ type: 'success', message: (0, i18n_1.t)('Email_verified') });
                }
            }
        });
    });
});
